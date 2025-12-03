import Api from "@utils/api"

import { EventData } from "@utils/@types/data/event"
import { UserInfo } from "@utils/@types/data/user"
import Validation from "@services/sqlite/models/Validation"
import ProductsList from "@services/sqlite/models/ProductsList"
import { getTicketName } from "./getTicketNames"
import { isTicketValidable } from "./getTicketValidable"

const validateQR = async (
  code: string,
  clientDb: string,
  event: EventData,
  user: UserInfo,
  hasConnection: boolean,
  token: string
): Promise<boolean> => {
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

        const { isValidable } = validableCheckage
        let { validableCode } = validableCheckage
        let ticketProductId = null

        if (isValidable) {
          const locallyValidated = await Validation.searchByTicket(
            validableCode
          )
          if (locallyValidated.length > 0) {
            const validation = locallyValidated[0]
            if (!Boolean(validation.synced)) {
              await Api.validateTicket(validableCode, event.id, token)
              await Validation.updateValidation(validableCode, true)
            }
            reject("Ticket já validado")
            return
          } else {
            const [prodsList, combos, userProdsList, webstoreTickets] = [
              await ProductsList.getUserList(user.id),
              await Api.getAllCombos(),
              await Api.getAllProducts(user.roleInfo.product_types ?? []),
              await Api.getAllWebstoreTickets(),
            ]

            const { id: prodId, name: prodName } = await getTicketName(
              upperCode,
              user.id,
              prodsList,
              user.roleInfo.product_types ?? [],
              userProdsList.ok ? userProdsList.data : [],
              combos.ok ? combos.data : [],
              webstoreTickets.ok ? webstoreTickets.data : []
            )

            let isEventTicket = prodName.length > 0
            ticketProductId = prodId

            if (!isEventTicket) {
              // Check if it's a webstore ticket
              const webstoreTicketDetailsRequest =
                await Api.getWebstoreTicketDetails(
                  validableCode,
                  event.id,
                  token
                )

              if (webstoreTicketDetailsRequest.ok) {
                isEventTicket = true
                validableCode = webstoreTicketDetailsRequest.data.webTicketUid
                ticketProductId = webstoreTicketDetailsRequest.data.productId
              }
            }

            if (isEventTicket) {
              const validation = await Api.validateTicket(
                validableCode,
                event.id,
                token
              )

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
                    resolve(true)
                    break
                  case 2:
                    // reject("Ticket já validado online. Sincronize seus dados.")
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
          "Validação disponível apenas online.\nVerifique a conexão e tente novamente."
        )
        return

        // Offline validation
        // if (locallyValidated.length > 0) {
        //   reject("Ticket já validado.")
        //   return
        // } else {
        //   registerLclValidation(ticket, user.id, false)
        //   resolve(true)
        // }
      }
    } catch (error) {
      reject(false)
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
