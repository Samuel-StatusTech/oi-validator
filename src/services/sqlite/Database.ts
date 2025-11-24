import * as SQLite from "expo-sqlite"
import { DBQueryCreateAllTables } from "./queries/tables/createAll"

const db = SQLite.openDatabaseSync("oiTicket-data.db")

// TODO: create others TABLES
export const createTables = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const creationProms: Promise<boolean>[] = DBQueryCreateAllTables.map(
        (q) => {
          const prom = new Promise<boolean>(async (promResolve, promReject) => {
            try {
              await db.execAsync(q)
              promResolve(true)
            } catch (error) {
              promReject(error)
            }
          })

          return prom
        }
      )

      await Promise.all(creationProms)

      console.log("Tables created successfully")

      resolve(true)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

export const dropTables = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const dropProms: Promise<boolean>[] = DBQueryCreateAllTables.map((q) => {
        const prom = new Promise<boolean>(async (promResolve, promReject) => {
          try {
            await db.execAsync(q)
            promResolve(true)
          } catch (error) {
            promReject(false)
          }
        })

        return prom
      })

      await Promise.all(dropProms)

      console.log("Table deleted successfully")

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export default db
