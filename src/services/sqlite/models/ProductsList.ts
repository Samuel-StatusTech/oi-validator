import db from "../Database"
import { IProductsList } from "@utils/@types/sqlite/productsList"

const insertList = async (list: IProductsList[]) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < list.length; i++) {
      const pl = list[i]
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO product_lists (
            id,
            list_id,
            pdv_id,
            user_id,
            reservation_id,
            combo_id,
            quantity
          ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            pl.product_id,
            pl.list_id,
            pl.pdv_id,
            pl.user_id,
            pl.reservation_id,
            pl.combo_id,
            pl.quantity
          ],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (i === list.length - 1) resolve(true)
          },
          (_, error) => {
            reject(error)
            return false
          }
        )
      })
    }
  })
}

const getLists = async (): Promise<IProductsList[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM product_lists;",
        [],
        //-----------------------
        async (_, { rows }) => {
          const list = rows._array
          resolve(list)
        },
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

const getUserList = async (userId: string): Promise<IProductsList[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM product_lists WHERE user_id = ?;",
        [userId],
        //-----------------------
        async (_, { rows }) => {
          const list = rows._array
          resolve(list)
        },
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

const ProductsList = {
  insertList,
  getLists,
  getUserList,
}

export default ProductsList
