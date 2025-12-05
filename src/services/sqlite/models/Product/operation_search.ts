import db from "@services/sqlite/Database"
import {
  selectAllProducts,
  selectProductsNoSync,
} from "@services/sqlite/queries/products"
import { IProduct } from "@utils/@types/sqlite/product"
import dbModelProduct from "."
import dbModelCombo from "../Combo"
import dbModelWebstoreTicket from "../WebstoreTicket"
import { TAllProducts } from "@utils/toolbox/auxFns/getUserProducts"

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const result = await db.getAllAsync<IProduct>(selectAllProducts)
    return result
  } catch (error) {
    throw error
  }
}

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

export const getAllPdvAndWebstoreProducts = async (): Promise<TAllProducts> => {
  let list: TAllProducts = []

  try {
    const allProducts = (await dbModelProduct.getAllProducts()) ?? []
    const allCombos = (await dbModelCombo.getAllCombos()) ?? []

    const allWebstoreTickets =
      (await dbModelWebstoreTicket.getEventWebstoreTicket()) ?? []

    const finalList = [
      ...allProducts,
      ...allCombos,
      ...allWebstoreTickets,
    ].filter((i: any) => {
      return i.status !== undefined ? Boolean(i.status) : true
    })

    list = finalList
  } catch (error) {}

  return list
}
