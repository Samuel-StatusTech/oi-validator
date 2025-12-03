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
    let list: IProduct[] = []

    const listStr = "'" + categories.join("', '") + "'"

    const allProducts = await db.getAllAsync<IProduct>(
      `SELECT * FROM products WHERE type IN (${listStr});`
    )

    list = [...list, ...allProducts.filter((i) => Boolean(i.status))]

    return list
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
