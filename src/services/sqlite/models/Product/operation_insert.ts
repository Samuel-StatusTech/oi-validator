import db from "@services/sqlite/Database"
import { insertProduct as insertProductQuery } from "@services/sqlite/queries/products"
import { safeTransactions } from "@services/sqlite/safeTransactions"
import { IProduct } from "@utils/@types/sqlite/product"
import { buildInsertParams } from "@utils/toolbox/dbHelpers"

export const insertProduct = async (product: IProduct) => {
  try {
    const result = await db.runAsync(
      insertProductQuery,
      buildInsertParams.product(product)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}
export const insertProducts = async (list: IProduct[]) => {
  if (!list?.length) return true

  try {
    const transactionResult = await safeTransactions(
      insertProductQuery,
      list,
      buildInsertParams.product
    )

    return transactionResult
  } catch (error) {
    console.log("Error inserting products:", error)
    return false
  }
}
