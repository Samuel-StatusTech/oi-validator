import db from "@services/sqlite/Database"
import { updateProductList as updateProductsListQuery, deleteAllProductLists } from "../../queries/productsLists"
import { IProductsList } from "@utils/@types/sqlite/productsList"
import { buildUpdateParams } from "@utils/toolbox/dbHelpers"
import { safeTransactions } from "@services/sqlite/safeTransactions"

export const clearProductsLists = async () => {
  await db.runAsync(deleteAllProductLists)
}

export const updateProductsList = async (productsList: IProductsList) => {
  try {
    const result = await db.runAsync(updateProductsListQuery, [
      productsList.list_id,
      productsList.pdv_id,
      productsList.user_id,
      productsList.reservation_id,
      productsList.combo_id,
      productsList.quantity,
      productsList.product_id,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateProductsLists = async (productsLists: IProductsList[]) => {
  if (!productsLists?.length) return true

  try {
    const transactionResult = await safeTransactions(
      updateProductsListQuery,
      productsLists,
      buildUpdateParams.productsList
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating products lists:", error)
    return false
  }
}
