import { IProductsList } from "@utils/@types/sqlite/productsList"

export const buildProductsListUpdateParams = (productsList: IProductsList) => [
  productsList.list_id,
  productsList.pdv_id,
  productsList.user_id,
  productsList.reservation_id,
  productsList.combo_id,
  productsList.quantity,
  productsList.product_id, // WHERE id = ?
]
