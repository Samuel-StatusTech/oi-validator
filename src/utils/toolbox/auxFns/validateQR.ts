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

const validateQR = async (
  code: string,
  clientDb: string,
  event: EventData,
  user: UserInfo,
  hasConnection: boolean,
  token: string
): Promise<{ validated: true; productName: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (hasConnection) {
        const upperCode = code.toUpperCase()

        const validableCheckage = isTicketValidable(
          upperCode,
          clientDb ?? user.db,
          event.oid,
          event.id
        )

        let { isValidable, validableCode } = validableCheckage
        let ticketProductId: string | null = null

        if (!isValidable) {
          const codeToRecheck = `${event.id}/${code}`.toUpperCase()

          const validableCheckage = isTicketValidable(
            codeToRecheck,
            clientDb ?? user.db,
            event.oid,
            event.id
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
              userProds
            )

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
                reject("A compra do ticket foi cancelada")
                return
              }

              if (!isOrderPayed) {
                reject("O pagamento do ticket não foi realizado")
                return
              }

              const canValidateThisTicket = userProds.find(
                (i) =>
                  (i as IProduct).id === ticketProductId ||
                  (i as IWebstoreTicket).product_id === ticketProductId
              )

              const productName = isWebticket ? webticketName : prodName

              if (!canValidateThisTicket) {
                reject(
                  "Produto não encontrado. Verifique sua lista de produtos e tente novamente"
                )
                return
              }

              // 1. Sync Validations
              const validationsSync =
                await Api.validations.getOnlineValidations({
                  eventId: event.id,
                })

              if (validationsSync.ok) {
                const onlineValidations = validationsSync.data
                Validation.insertOrReplaceValidations(onlineValidations)
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
                        ""
                      )
                    )
                    resolve({ validated: true, productName: productName })
                    break
                  case 2:
                    reject("Ticket já validado.")
                    break
                  case 3:
                    reject("Não foi possível validar. Produto não encontrado")
                    break
                  default:
                    reject("Ticket cancelado")
                    break
                }
              } else {
                reject(
                  "Não foi possível validar. Verifique sua conexão e tente novamente"
                )
              }
            } else {
              reject("Produto não encontrado")
              return
            }
          }
        } else {
          reject("Este ticket não pertence ao evento")
          return
        }
      } else {
        reject(
          "Validação disponível apenas online.\nVerifique a conexão e tente novamente"
        )
        return
      }
    } catch (error) {
      console.log("Erro: ")
      console.log("Erro: ", error)
      console.log("Erro: ")
      reject("Houve um erro.\nTente novamente mais tarde")
      return
    }
  })
}

const registerLclValidation = async (
  ticketUid: string,
  userId: string,
  sync: boolean,
  ticketProductId: string,
  ticketReadableCode: string
) => {
  await Validation.insertValidation(
    ticketUid,
    userId,
    sync,
    new Date().getTime(),
    new Date().getTime(),
    ticketProductId,
    ticketReadableCode
  )
}

export default validateQR
