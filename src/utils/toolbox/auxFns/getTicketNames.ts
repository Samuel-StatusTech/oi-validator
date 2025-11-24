import { UserInfo } from "@utils/@types/data/user"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IProduct } from "@utils/@types/sqlite/product"
import { IProductsList } from "@utils/@types/sqlite/productsList"
import { IValidation } from "@utils/@types/sqlite/validation"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import Api from "@utils/api"

const getTicketName = async (
  ticket: string,
  userId: string,
  productList: IProductsList[],
  product_types: any[],
  allProducts: IProduct[],
  allCombos: ICombo[],
  allWebstoreTickets: IWebstoreTicket[]
) => {
  let productName = ""

  const [type, prodOId] = [ticket.substring(0, 1), ticket.substring(7, 10)]
  let prods: any[] = []

  if (type == "A" || type == "B" || type == "C") {
    prods = allProducts

    for (const idx in prods) {
      if (
        prodOId ==
        parseInt(String(prods[idx].o_id))
          .toString(36)
          .padStart(3, "0")
          .slice(0, 3)
          .toUpperCase()
      ) {
        if (
          product_types?.find((type: any) => type == prods[idx].type) ||
          productList.find(
            (pl: any) => pl.user_id == userId && pl.product_id == prods[idx].uid
          )
        ) {
          productName = prods[idx].name
          break
        }
      }
    }
  } else {
    prods = allCombos
    for (const idx in prods) {
      if (
        prodOId ==
        parseInt(String(prods[idx].o_id))
          .toString(36)
          .padStart(3, "0")
          .slice(0, 3)
          .toUpperCase()
      ) {
        if (
          product_types?.find((type) => type == prods[idx].direction) ||
          productList.find(
            (pl) => pl.user_id == userId && pl.product_id == prods[idx].uid
          )
        ) {
          productName = prods[idx].name
          break
        }
      }
    }
  }

  return productName
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

  const [productList, allProducts, allCombos, allWebstoreTickets] =
    await Promise.all([
      await Api.getProductsList(),
      await Api.getAllProducts(user.roleInfo.product_types ?? []),
      await Api.getAllCombos(),
      await Api.getAllWebstoreTickets(),
    ])

  if (productList.ok && allProducts.ok && allCombos.ok) {
    tickets.forEach(async (ticket) => {
      const name = await getTicketName(
        ticket.uid,
        user.id,
        productList.data as IProductsList[],
        user.roleInfo.product_types ?? [],
        allProducts.data,
        allCombos.data,
        allWebstoreTickets.ok ? allWebstoreTickets?.data : []
      )

      res.push({ ...ticket, name })
    })
  }

  return res
}

export { getTicketName, getTicketsNames }
