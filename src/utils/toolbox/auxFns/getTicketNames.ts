import { IValidation } from "@utils/@types/sqlite/validation"
import { getUserProducts, TAllProducts } from "./getUserProducts"
import { IProduct } from "@utils/@types/sqlite/product"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import dbModelProduct from "@services/sqlite/models/Product"

const getTicketName = async (
  ticket: string,
  shouldFilterUserProducts: boolean = true,
  productsList?: TAllProducts,
  isSearchingBy: "qrCode" | "id" = "qrCode"
) => {
  const ticketProdOid = ticket.substring(7, 10)

  let productId = ""
  let productName = ""

  try {
    let userProducts: TAllProducts = []

    if (productsList) userProducts = productsList
    else {
      if (shouldFilterUserProducts) userProducts = await getUserProducts()
      else {
        const allProds = await dbModelProduct.getAllProducts()
        userProducts = allProds
      }
    }

    const matchItem = userProducts.find((i) => {
      const isWebstoreTicket = (i as IWebstoreTicket).product_id !== undefined

      if (isWebstoreTicket) return (i as IWebstoreTicket).product_id === ticket
      else {
        let doesMatch = false

        if (isSearchingBy === "qrCode") {
          const prodId = getProductUidFromQrCode(i as any)

          doesMatch = ticketProdOid === prodId
        } else {
          doesMatch = (i as IProduct | ICombo).id === ticket
        }

        return doesMatch
      }
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

  const userProducts = await getUserProducts()

  tickets.forEach(async (ticket) => {
    const { name } = await getTicketName(
      ticket.ticketProductId ?? ticket.uid,
      false,
      userProducts,
      "id"
    )

    res.push({ ...ticket, name })
  })

  return res
}

const getProductUidFromQrCode = (product: IProduct | ICombo) => {
  const prodOId = parseInt(String(product.oid ?? (product as IProduct).o_id))
    .toString(36)
    .padStart(3, "0")
    .slice(0, 3)
    .toUpperCase()

  return prodOId
}

export { getTicketName, getTicketsNames }
