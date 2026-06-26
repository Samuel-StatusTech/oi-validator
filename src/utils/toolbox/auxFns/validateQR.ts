import Api from "src/api"

import { EventData } from "@utils/@types/data/event"
import { UserInfo } from "@utils/@types/data/user"
import Validation from "@services/sqlite/models/Validation"
import { getTicketName } from "./getTicketNames"
import { isTicketValidable } from "./getTicketValidable"
import { getUserProducts } from "./getUserProducts"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import { IProduct } from "@utils/@types/sqlite/product"
import { checkLocallyValidation } from "./validateQR/checkLocallyValidation"
import { formatLocalDateTime } from "./formatDate"
import { validationsErrorMessages } from "./validateQR/validationsMessages"
import { getComboForProduct } from "./getComboForProduct"

let lastBackgroundSync = 0
const SYNC_COOLDOWN_MS = 30000

const validateQR = async (
  code: string,
  clientDb: string,
  event: EventData,
  user: UserInfo,
  hasConnection: boolean,
  token: string,
  onSync: (showFeedback?: boolean) => Promise<void> = () => Promise.resolve(),
  retries = 0,
  setIsRetrying: React.Dispatch<React.SetStateAction<boolean>> = () => {},
): Promise<{ validated: true; productName: string; comboName?: string; showTitle: boolean }> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (retries == 0) setIsRetrying(false)

      if (hasConnection) {
        const upperCode = code.toUpperCase()

        const validableCheckage = isTicketValidable(
          upperCode,
          clientDb ?? user.db,
          event.oid,
          event.id,
        )

        let { isValidable, validableCode } = validableCheckage
        let ticketProductId: string | null = null

        if (!isValidable) {
          const codeToRecheck = `${event.id}/${code}`.toUpperCase()

          const validableCheckage = isTicketValidable(
            codeToRecheck,
            clientDb ?? user.db,
            event.oid,
            event.id,
          )

          isValidable = validableCheckage.isValidable
          validableCode = validableCheckage.validableCode
        }

        if (isValidable) {
          const locallyValidated = await checkLocallyValidation({
            eventId: event.id,
            validableCode,
          })

          if (locallyValidated?.validated) {
            const validation = locallyValidated.validation
            if (!Boolean(validation.synced)) {
              await Api.validations.validateTicket({
                ticketUid: validableCode,
                eventId: event.id,
              })
              await Validation.updateValidation(validableCode, true)
            }

            reject(locallyValidated.message)
            return
          } else {
            const userProds = await getUserProducts()

            const { id: prodId, name: prodName } = await getTicketName(
              upperCode,
              true,
              userProds,
            )

            const comboInfo = prodId ? await getComboForProduct(prodId) : null

            let isWebticket = false
            let webticketName = ""
            let isTicketCanceled = false
            let isOrderPayed = true
            let isEventTicket = prodName.length > 0
            ticketProductId = prodId

            if (!isEventTicket) {
              // Check if it's a webstore ticket
              const webstoreTicketDetailsRequest =
                await Api.tickets.getWebstoreTicketDetails({
                  qrCode: validableCode,
                  eventId: event.id,
                })

              if (webstoreTicketDetailsRequest.ok) {
                isWebticket = true
                isEventTicket = true
                isTicketCanceled =
                  webstoreTicketDetailsRequest.data.isTicketCanceled
                isOrderPayed = webstoreTicketDetailsRequest.data.isOrderPayed
                validableCode = webstoreTicketDetailsRequest.data.webTicketUid
                ticketProductId = webstoreTicketDetailsRequest.data.productId
                webticketName = webstoreTicketDetailsRequest.data.productName
              }
            }

            if (isEventTicket) {
              if (isTicketCanceled) {
                reject(validationsErrorMessages.cancelledPurchase)
                return
              }

              if (!isOrderPayed) {
                reject(validationsErrorMessages.notPayed)
                return
              }

              const canValidateThisTicket = userProds.find(
                (i) =>
                  (i as IProduct).id === ticketProductId ||
                  (i as IWebstoreTicket).product_id === ticketProductId,
              )

              let productName = isWebticket ? webticketName : prodName
              let comboName: string | undefined

              if (!isWebticket && comboInfo) {
                if (comboInfo.ticketType === "unica") {
                  productName = comboInfo.comboName
                } else if (comboInfo.ticketType === "varias") {
                  comboName = comboInfo.comboName
                }
              }

              if (!canValidateThisTicket) {
                // Sync and retry
                setIsRetrying(true)
                await onSync(false)

                if (retries == 0) {
                  await validateQR(
                    code,
                    clientDb,
                    event,
                    user,
                    hasConnection,
                    token,
                    onSync,
                    retries + 1,
                    setIsRetrying,
                  )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err))
                } else {
                  reject(validationsErrorMessages.notFound)
                }

                return
              }

              // Check ticket validation status online
              const validationCheck =
                await Api.validations.checkTicketValidation({
                  eventId: event.id,
                  qrCode: validableCode,
                })

              if (validationCheck.ok) {
                const validated_at = validationCheck.data.date_validated
                const status = validationCheck.data.status
                if (status === "validado") {
                  reject(
                    validationsErrorMessages.alreadyValidated.replace(
                      "{date}",
                      formatLocalDateTime(validated_at as any),
                    ),
                  )
                  return
                }
              }

              // 2. Search Validations locally again
              const locallyValidated = await checkLocallyValidation({
                eventId: event.id,
                validableCode,
              })

              if (locallyValidated?.validated) {
                const validation = locallyValidated.validation
                if (!Boolean(validation.synced)) {
                  await Api.validations.validateTicket({
                    ticketUid: validableCode,
                    eventId: event.id,
                  })
                  await Validation.updateValidation(validableCode, true)
                }

                reject(locallyValidated.message)
                return
              }

              // 3. If not found, proceed to validate online
              const validation = await Api.validations.validateTicket({
                ticketUid: validableCode,
                eventId: event.id,
              })

              if (validation.ok) {
                switch (validation.data) {
                  case 1:
                    await registerLclValidation(
                      validableCode,
                      user.id,
                      true,
                      ticketProductId,
                      upperCode.replace(
                        `${(event?.id ?? "").toUpperCase()}/`,
                        "",
                      ),
                    )
                    resolve({
                      validated: true,
                      productName,
                      comboName,
                      showTitle: true,
                    })

                    const now = Date.now()
                    if (now - lastBackgroundSync > SYNC_COOLDOWN_MS) {
                      lastBackgroundSync = now
                        onSync(false).catch(() => {})
                    }
                    break
                  case 2:
                    reject(validationsErrorMessages.alreadyValidatedShort)
                    break
                  case 3:
                    reject(validationsErrorMessages.unableToValidate)
                    break
                  default:
                    reject(validationsErrorMessages.cancelledTicket)
                    break
                }
              } else {
                reject(validationsErrorMessages.verifyConnection)
              }
            } else {
              // Sync and retry
              if (retries == 0) {
                setIsRetrying(true)
                await onSync(false)

                await validateQR(
                  code,
                  clientDb,
                  event,
                  user,
                  hasConnection,
                  token,
                  onSync,
                  retries + 1,
                  setIsRetrying,
                )
                  .then((res) => resolve(res))
                  .catch((err) => reject(err))
              } else {
                reject(validationsErrorMessages.notFoundOnEvent)
              }
              return
            }
          }
        } else {
          reject(validationsErrorMessages.anotherEventProduct)
          return
        }
      } else {
        reject(validationsErrorMessages.noConnection)
        return
      }
    } catch (error) {
      reject(validationsErrorMessages.theresAnError)
      return
    }
  })
}

const registerLclValidation = async (
  ticketUid: string,
  userId: string,
  sync: boolean,
  ticketProductId: string,
  ticketReadableCode: string,
) => {
  await Validation.insertValidation(
    ticketUid,
    userId,
    sync,
    new Date().getTime(),
    new Date().getTime(),
    ticketProductId,
    ticketReadableCode,
  )
}

export default validateQR
