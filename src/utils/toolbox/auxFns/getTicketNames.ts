import { UserInfo } from "@utils/@types/data/user"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IProduct } from "@utils/@types/sqlite/product"
import { IValidation } from "@utils/@types/sqlite/validation"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import Api from "@utils/api"

const getTicketName = async (
  ticket: string,
  allProducts: IProduct[],
  allCombos: ICombo[],
  allWebstoreTickets: IWebstoreTicket[]
) => {
  let productId = ""
  let productName = ""

  const matchProduct = allProducts.find((i) => i.id === ticket)
  if (matchProduct) {
    productId = matchProduct.id
    productName = matchProduct.name
  }

  if (!productName) {
    // Combo
    const matchCombo = allCombos.find((i) => i.id === ticket)
    if (matchCombo) {
      productId = matchCombo.id
      productName = matchCombo.name
    }
  }

  if (!productName) {
    // WebstoreTicket
    const matchWebTicket = allWebstoreTickets.find(
      (webstoreTicket) => webstoreTicket.product_id === ticket
    )

    if (matchWebTicket) {
      productId = matchWebTicket.product_id
      productName = matchWebTicket.name
    }
  }

  return { id: productId, name: productName }
}

const getTicketsNames = async (tickets: IValidation[], user: UserInfo) => {
  let res: {
    uid: string
    user_id: string
    synced: number
    created_at: Readonly<Date>
    updated_at: Readonly<Date>
    name: string
  }[] = []

  const [allProducts, allCombos, allWebstoreTickets] = await Promise.all([
    await Api.getAllProducts(user.roleInfo.product_types ?? []),
    await Api.getAllCombos(),
    await Api.getAllWebstoreTickets(),
  ])

  if (allProducts.ok && allCombos.ok) {
    tickets.forEach(async (ticket) => {
      const { name } = await getTicketName(
        ticket.ticketProductId ?? ticket.uid,
        allProducts.data as any[],
        allCombos.data,
        allWebstoreTickets.ok ? allWebstoreTickets?.data : []
      )

      res.push({ ...ticket, name })
    })
  }

  return res
}

export { getTicketName, getTicketsNames }
