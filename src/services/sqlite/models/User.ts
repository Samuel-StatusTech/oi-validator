import db from "../Database"


export const getUsers = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users;",
        [],
        //-----------------------
        async (_, { rows }) => {
          const list = rows._array
          const userOperators = await getUserOperators() as any[]   // todo: type
          for (const key in list) {
            const config = userOperators.find((e) => e.user_id == list[key].uid)
            list[key]["config"] = config && config._raw ? config._raw : {}
          }
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

export const getUserOperators = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user_operators;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

export const getUserValidators = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user_validators;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

export const getWaiterByCode = async (code: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM waiters WHERE code LIKE ?;",
        [code],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0])
          else resolve(undefined)
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
  getUsers,
  getUserOperators,
  getUserValidators,
  getWaiterByCode,
}
