import db from "@services/sqlite/Database"
import {
  selectAllProductLists,
  selectProductListsByUser,
} from "@services/sqlite/queries/productsLists"
import { IProductsList } from "@utils/@types/sqlite/productsList"

export const getLists = async (): Promise<IProductsList[]> => {
  try {
    const result = await db.getAllAsync<IProductsList>(selectAllProductLists)
    return result
  } catch (error) {
    throw error
  }
}

export const getUserList = async (userId: string): Promise<IProductsList[]> => {
  try {
    const result = await db.getAllAsync<IProductsList>(
      selectProductListsByUser,
      [userId]
    )
    return result
  } catch (error) {
    throw error
  }
}
