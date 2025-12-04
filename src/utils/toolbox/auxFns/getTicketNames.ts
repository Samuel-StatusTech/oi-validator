import { IValidation } from "@utils/@types/sqlite/validation"
import { filterUserProducts } from "./filterUserProducts"
import { IProduct } from "@utils/@types/sqlite/product"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

const getTicketName = async (ticket: string) => {
  let productId = ""
  let productName = ""

  try {
    const userProducts = await filterUserProducts()

    const matchItem = userProducts.find((i) => {
      return (
        (i as IProduct | ICombo).id === ticket ||
        (i as IWebstoreTicket).product_id === ticket
      )
    })

    if (matchItem) {
      productId =
        (matchItem as IProduct | ICombo).id ??
        (matchItem as IWebstoreTicket).product_id
      productName = matchItem.name
    }
  } catch (error) {}

  return { id: productId, name: productName }
}

const getTicketsNames = async (tickets: IValidation[]) => {
  let res: {
    uid: string
    user_id: string
    synced: number
    created_at: Readonly<Date>
    updated_at: Readonly<Date>
    name: string
  }[] = []

  tickets.forEach(async (ticket) => {
    const { name } = await getTicketName(ticket.ticketProductId ?? ticket.uid)
    res.push({ ...ticket, name })
  })

  return res
}

export { getTicketName, getTicketsNames }
