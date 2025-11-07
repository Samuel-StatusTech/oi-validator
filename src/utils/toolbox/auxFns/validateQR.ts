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
    const upperCode = code.toUpperCase()

    const isValidable = isTicketValidable(
      upperCode,
      clientDb ?? user.db,
      event.oid
    )

    if (isValidable) {
      const ticket = code.toUpperCase()
      const locallyValidated = await Validation.searchByTicket(ticket)

      if (hasConnection) {
        if (locallyValidated.length > 0) {
          const validation = locallyValidated[0]
          if (!Boolean(validation.synced)) {
            await Api.validateTicket(ticket, event.id, token)
            await Validation.updateValidation(ticket, true)
          }
          reject("Ingresso já validado")
          return
        } else {
          const [prodsList, combos, userProdsList] = [
            await ProductsList.getUserList(user.id),
            await Api.getAllCombos(),
            await Api.getAllProducts(user.roleInfo.product_types ?? []),
          ]

          const prodName = await getTicketName(
            upperCode,
            user.id,
            prodsList,
            user.roleInfo.product_types ?? [],
            userProdsList.ok ? userProdsList.data : [],
            combos.ok ? combos.data : []
          )

          if (prodName.length > 0) {
            const validation = await Api.validateTicket(ticket, event.id, token)
            if (validation.ok) {
              switch (validation.data) {
                case 1:
                  await registerLclValidation(ticket, user.id, true)
                  resolve(true)
                  break
                case 2:
                  reject("Ingresso já validado online. Sincronize seus dados.")
                  break
                case 3:
                  reject("Não foi possível validar. Produto não encontrado")
                  break
                default:
                  reject("Ingresso cancelado")
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
        if (locallyValidated.length > 0) {
          reject("Ingresso já validado.")
          return
        } else {
          registerLclValidation(ticket, user.id, false)
          resolve(true)
        }
      }
    } else {
      reject("Este ticket não pertence ao evento")
      return
    }
  })
}

const registerLclValidation = async (
  ticketUid: string,
  userId: string,
  sync: boolean
) => {
  await Validation.insertValidation(
    ticketUid,
    userId,
    false,
    new Date().getTime(),
    new Date().getTime()
  )
}

export default validateQR
