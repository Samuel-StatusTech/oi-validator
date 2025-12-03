import db from "@services/sqlite/Database"
import {
  selectAllProducts,
  selectProductsNoSync,
} from "@services/sqlite/queries/products"
import { selectAllWebTickets } from "@services/sqlite/queries/webstoreTickets"
import { IProduct } from "@utils/@types/sqlite/product"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import dbModelWebstoreTicket from "../WebstoreTicket"
import Api from "@utils/api"
import { ICombo } from "@utils/@types/sqlite/combo"

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
): Promise<(IProduct | ICombo | IWebstoreTicket)[]> => {
  try {
    let list: (IProduct | ICombo | IWebstoreTicket)[] = []

    const listStr = "'" + categories.join("', '") + "'"

    const allProducts = await db.getAllAsync<IProduct>(
      `SELECT * FROM products WHERE type IN (${listStr});`
    )

    list = [...list, ...allProducts.filter((i) => Boolean(i.status))]

    const allCombos = await db.getAllAsync<ICombo>(`SELECT * FROM combos;`)

    list = [...list, ...allCombos.filter((i) => Boolean(i.status))]

    if (categories.includes("ingresso")) {
      const webstoreTicketsResult = await Api.getAllWebstoreTickets()

      if (webstoreTicketsResult.ok) {
        list = [
          ...list,
          ...webstoreTicketsResult.data.filter((i) => Boolean(i.active)),
        ]
      }
    }

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
