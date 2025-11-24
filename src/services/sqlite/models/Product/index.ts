import { insertProduct, insertProducts } from "./operation_insert"
import { updateProduct, updateProducts } from "./operation_update"
import {
  getEventProducts,
  getUserProducts,
  getProductsNoSync,
} from "./operation_search"

const dbModelProduct = {
  insertProduct,
  insertProducts,

  updateProduct,
  updateProducts,

  getEventProducts,
  getUserProducts,
  getProductsNoSync,
}

export default dbModelProduct
