import { ICombo } from "@utils/@types/sqlite/combo"
import db from "../Database"

const insertCombos = async (list: ICombo[]) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < list.length; i++) {
      const c = list[i]
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO combos (
            id,
            oid,
            favorite,
            org_id,
            name,
            image,
            description1,
            description2,
            ticket_type,
            price_sell,
            status,
            direction,
            print_qrcode,
            print_ticket,
            print_local,
            print_date,
            print_value,
            created_at,
            updated_at,
            group_id,
            archived
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            c.id,
            c.oid,
            c.favorite,
            c.org_id,
            c.name,
            c.image,
            c.description1,
            c.description2,
            c.ticket_type,
            c.price_sell,
            c.status,
            c.direction,
            c.print_qrcode,
            c.print_ticket,
            c.print_local,
            c.print_date,
            c.print_value,
            c.created_at as string ?? new Date().getTime(),
            c.updated_at as string ?? new Date().getTime(),
            c.group_id,
            c.archived ?? 0
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

const getAllCombos = async (): Promise<ICombo[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM combos;",
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

const Combo = {
  insertCombos,
  getAllCombos,
}

export default Combo
