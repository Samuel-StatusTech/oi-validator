import db from "../Database"

const getOrdersNoSync = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    resolve([])
    
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `SELECT * FROM orders WHERE synced = 0;`,
    //     [],
    //     //-----------------------
    //     async (_, { rows }) => {
    //       const list = rows._array
    //       resolve(list)
    //     },
    //     (_, error) => {
    //       reject(error)
    //       return false
    //     }
    //   )
    // })
  })
}

export default {
  getOrdersNoSync,
}
