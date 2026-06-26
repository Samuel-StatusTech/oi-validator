import db from "@services/sqlite/Database"
import {
  selectAllProductLists,
  selectProductListsByUser,
  selectProductListByProductId,
  selectProductListsByProductId,
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

export const getListByProductId = async (productId: string): Promise<IProductsList | null> => {
  try {
    const result = await db.getFirstAsync<IProductsList>(selectProductListByProductId, [productId])
    return result ?? null
  } catch (error) {
    return null
  }
}

export const getListsByProductId = async (productId: string): Promise<IProductsList[]> => {
  try {
    const result = await db.getAllAsync<IProductsList>(selectProductListsByProductId, [productId])
    return result ?? []
  } catch (error) {
    return []
  }
}
