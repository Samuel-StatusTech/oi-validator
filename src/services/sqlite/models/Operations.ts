import db from "../Database"

export const getOperations = async (userUid: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT FROM operations WHERE employee_id = ?;",
        [userUid],
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

export const getOperationsNoSync = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    resolve([])
    return
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT FROM operations WHERE synced = 0;",
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

export default {
  getOperationsNoSync,
}
