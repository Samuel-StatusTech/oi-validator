import db from "@services/sqlite/Database"
import { insertProductList as insertProductsListQuery } from "../../queries/productsLists"
import { IProductsList } from "@utils/@types/sqlite/productsList"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { buildInsertParams } from "@utils/toolbox/dbHelpers"

export const insertProductsList = async (productsList: IProductsList) => {
  try {
    const result = await db.runAsync(
      insertProductsListQuery,
      buildInsertParams.productsList(productsList)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertProductsLists = async (list: IProductsList[]) => {
  if (!list?.length) return true

  try {
    const transactionResult = await safeTransactions(
      insertProductsListQuery,
      list,
      buildInsertParams.productsList
    )

    return transactionResult
  } catch (error) {
    console.log("Error inserting products:", error)
    return false
  }
}
