import { ICombo } from "@utils/@types/sqlite/combo"
import { IProduct } from "@utils/@types/sqlite/product"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import Api from "@utils/api"
import useStore from "src/store"

type TAllProducts = (IProduct | ICombo | IWebstoreTicket)[]

export const filterUserProducts = async (): Promise<TAllProducts> => {
  let finalList: TAllProducts = []
  try {
    const user = useStore.getState().user

    if (!user) throw new Error()

    const [allProducts, allCombos, allWebstoreTickets] = [
      await Api.getAllProducts(user.roleInfo.product_types ?? []),
      await Api.getAllCombos(),
      await Api.getAllWebstoreTickets(),
    ]

    if (!allProducts.ok || !allCombos.ok || !allWebstoreTickets.ok)
      throw new Error()

    const products: TAllProducts = [
      ...allProducts.data,
      ...allCombos.data,
      ...allWebstoreTickets.data,
    ]

    // Validator config
    const userProductsTypes: string[] = user?.roleInfo.product_types as string[]
    const userProductsSpecificList: { id: string }[] =
      user?.roleInfo.products ?? []
    const userProductsSpecificIds = userProductsSpecificList.map((i) => i.id)

    // Filtering
    products.forEach((product) => {
      const productRegisterId =
        (product as IProduct | ICombo).id ??
        (product as IWebstoreTicket).product_id

      const isTypeIncluded =
        userProductsTypes.includes((product as IProduct).type ?? "") ||
        (product as ICombo).type === "combo" ||
        (!(product as any).type &&
          (product as IWebstoreTicket).product_id &&
          userProductsTypes.includes("ingresso"))

      if (
        userProductsSpecificIds.includes(productRegisterId) ||
        isTypeIncluded
      ) {
        finalList.push(product)
      }
    })
  } catch (error) {
    finalList = []
  }

  return finalList
}
