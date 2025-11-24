import db from "@services/sqlite/Database"
import { insertProductList as insertProductsListQuery } from "../../queries/productsLists"
import { IProductsList } from "@utils/@types/sqlite/productsList"

export const insertProductsList = async (productsList: IProductsList) => {
  try {
    const result = await db.runAsync(insertProductsListQuery, [
      productsList.product_id,
      productsList.list_id,
      productsList.pdv_id,
      productsList.user_id,
      productsList.reservation_id,
      productsList.combo_id,
      productsList.quantity,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertProductsLists = async (events: IProductsList[]) => {
  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    try {
      await insertProductsList(e)
    } catch (error) {
      console.error("Error inserting products list:", error)
    }
  }
  return true
}
