import db from "../Database"
import { IProduct } from "@utils/@types/sqlite/product"
import { insertProduct, selectAllProducts, selectProductsByType, selectProductsNoSync } from "../queries/products"

const insertProducts = async (list: IProduct[]) => {
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    try {
      await db.runAsync(insertProduct, [
        p.id,
        p.oid,
        p.org_id,
        p.name,
        p.image,
        p.status,
        p.type,
        p.group_id,
        p.warehouse_type,
        p.description1,
        p.description2,
        p.has_variable,
        p.has_courtesy,
        p.has_control,
        p.has_cut,
        p.has_tolerance,
        p.print_qrcode,
        p.print_ticket,
        p.print_local,
        p.print_date,
        p.print_value,
        p.print_group,
        p.print_plate,
        p.print_tolerance,
        p.price_cost,
        p.price_sell,
        p.quantity,
        p.start_at,
        p.number_copy,
        p.time_tolerance,
        p.value_tolerance,
        p.created_at,
        p.updated_at,
        p.status,
        p.archived ?? 0,
      ]);
    } catch (error) {
      console.error("Error inserting product:", error);
    }
  }
  return true;
}

const getEventProducts = async (): Promise<IProduct[]> => {
  try {
    const result = await db.getAllAsync<IProduct>(selectAllProducts);
    return result;
  } catch (error) {
    throw error;
  }
}

const getUserProducts = async (categories: string[]): Promise<IProduct[]> => {
  try {
    const listStr = "'" + categories.join("', '") + "'";
    const result = await db.getAllAsync<IProduct>(`SELECT * FROM products WHERE type IN (${listStr});`);
    return result;
  } catch (error) {
    throw error;
  }
}

const getProductsNoSync = async (): Promise<IProduct[]> => {
  try {
    const result = await db.getAllAsync<IProduct>(selectProductsNoSync);
    return result;
  } catch (error) {
    throw error;
  }
}

const Product = {
  insertProducts,
  getEventProducts,
  getUserProducts,
  getProductsNoSync,
}

export default Product
