import { IValidation } from "@utils/@types/sqlite/validation"
import { getUserProducts, TAllProducts } from "./getUserProducts"
import { IProduct } from "@utils/@types/sqlite/product"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import Api from "@utils/api"

const getTicketName = async (
  ticket: string,
  shouldFilterUserProducts: boolean = true,
  productsList?: TAllProducts
) => {
  let productId = ""
  let productName = ""

  try {
    let userProducts: TAllProducts = []

    if (productsList) userProducts = productsList
    else {
      if (shouldFilterUserProducts) userProducts = await getUserProducts()
      else {
        const allProds = await Api.getAllPdvAndWebstoreProducts()
        if (allProds.ok) userProducts = allProds.data
      }
    }

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

  let userProducts: TAllProducts = []

  const allProds = await Api.getAllPdvAndWebstoreProducts()
  if (allProds.ok) userProducts = allProds.data

  tickets.forEach(async (ticket) => {
    const { name } = await getTicketName(
      ticket.ticketProductId ?? ticket.uid,
      false,
      userProducts
    )

    res.push({ ...ticket, name })
  })

  return res
}

export { getTicketName, getTicketsNames }
