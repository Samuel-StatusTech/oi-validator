import db from "@services/sqlite/Database"
import {
  selectAllProducts,
  selectProductsNoSync,
} from "@services/sqlite/queries/products"
import { IProduct } from "@utils/@types/sqlite/product"

export const getEventProducts = async (): Promise<IProduct[]> => {
  try {
    const result = await db.getAllAsync<IProduct>(selectAllProducts)
    return result
  } catch (error) {
    throw error
  }
}

export const getUserProducts = async (
  categories: string[]
): Promise<IProduct[]> => {
  try {
    const listStr = "'" + categories.join("', '") + "'"
    const result = await db.getAllAsync<IProduct>(
      `SELECT * FROM products WHERE type IN (${listStr});`
    )
    return result
  } catch (error) {
    throw error
  }
}

export const getProductsNoSync = async (): Promise<IProduct[]> => {
  try {
    const result = await db.getAllAsync<IProduct>(selectProductsNoSync)
    return result
  } catch (error) {
    throw error
  }
}
