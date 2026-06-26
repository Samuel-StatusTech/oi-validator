import { insertProductsList, insertProductsLists } from "./operation_insert"
import { updateProductsList, updateProductsLists, clearProductsLists } from "./operation_update"
import { getLists, getUserList, getListByProductId, getListsByProductId } from "./operation_search"

const dbModelProductsList = {
  insertProductsList,
  insertProductsLists,

  updateProductsList,
  updateProductsLists,
  clearProductsLists,

  getLists,
  getUserList,
  getListByProductId,
  getListsByProductId,
}

export default dbModelProductsList
