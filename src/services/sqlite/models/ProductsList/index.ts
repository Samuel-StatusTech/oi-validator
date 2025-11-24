import { insertProductsList, insertProductsLists } from "./operation_insert"
import { updateProductsList, updateProductsLists } from "./operation_update"
import { getLists, getUserList } from "./operation_search"

const dbModelProductsList = {
  insertProductsList,
  insertProductsLists,

  updateProductsList,
  updateProductsLists,

  getLists,
  getUserList,
}

export default dbModelProductsList
