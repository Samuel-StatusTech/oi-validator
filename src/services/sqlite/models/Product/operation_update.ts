import db from "@services/sqlite/Database"
import { updateProduct as updateProductQuery } from "../../queries/products"
import { IProduct } from "@utils/@types/sqlite/product"
import { buildUpdateParams } from "@utils/toolbox/dbHelpers/index"
import { safeTransactions } from "@services/sqlite/safeTransactions"

export const updateProduct = async (product: IProduct) => {
  try {
    const result = await db.runAsync(
      updateProductQuery,
      buildUpdateParams.product(product)
    )
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateProducts = async (products: IProduct[]) => {
  if (!products?.length) return true

  try {
    const transactionResult = await safeTransactions(
      updateProductQuery,
      products,
      buildUpdateParams.product
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating products:", error)
    return false
  }
}
