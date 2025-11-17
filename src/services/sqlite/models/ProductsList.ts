import db from "../Database"
import { IProductsList } from "@utils/@types/sqlite/productsList"
import { insertProductList, selectAllProductLists, selectProductListsByUser } from "../queries/productsLists"

const insertList = async (list: IProductsList[]) => {
  for (let i = 0; i < list.length; i++) {
    const pl = list[i]
    try {
      await db.runAsync(insertProductList, [
        pl.product_id,
        pl.list_id,
        pl.pdv_id,
        pl.user_id,
        pl.reservation_id,
        pl.combo_id,
        pl.quantity
      ]);
    } catch (error) {
      console.error("Error inserting product list:", error);
    }
  }
  return true;
}

const getLists = async (): Promise<IProductsList[]> => {
  try {
    const result = await db.getAllAsync<IProductsList>(selectAllProductLists);
    return result;
  } catch (error) {
    throw error;
  }
}

const getUserList = async (userId: string): Promise<IProductsList[]> => {
  try {
    const result = await db.getAllAsync<IProductsList>(selectProductListsByUser, [userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

const ProductsList = {
  insertList,
  getLists,
  getUserList,
}

export default ProductsList
