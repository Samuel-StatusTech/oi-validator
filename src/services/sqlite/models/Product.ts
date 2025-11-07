import db from "../Database"
import { IProduct } from "@utils/@types/sqlite/product"

const insertProducts = async (list: IProduct[]) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < list.length; i++) {
      const p = list[i]
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO products (
            id,
            o_id,
            org_id,
            name,
            image,
            status,
            type,
            group_id,
            warehouse_type,
            description1,
            description2,
            has_variable,
            has_courtesy,
            has_control,
            has_cut,
            has_tolerance,
            print_qrcode,
            print_ticket,
            print_local,
            print_date,
            print_value,
            print_group,
            print_plate,
            print_tolerance,
            price_cost,
            price_sell,
            quantity,
            start_at,
            number_copy,
            time_tolerance,
            value_tolerance,
            created_at,
            updated_at,
            synced,
            archived
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
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

const getEventProducts = async (): Promise<IProduct[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM products;",
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

const getUserProducts = async (categories: string[]): Promise<IProduct[]> => {
  return new Promise((resolve, reject) => {
    let listStr = "'" + categories.join("', '") + "'"
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM products WHERE type IN (${listStr});`,
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

const getProductsNoSync = async (): Promise<IProduct[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM products WHERE synced = 0;`,
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

const Product = {
  insertProducts,
  getEventProducts,
  getUserProducts,
  getProductsNoSync,
}

export default Product
