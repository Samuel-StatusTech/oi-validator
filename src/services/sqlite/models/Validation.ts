import { IValidation } from "@utils/@types/sqlite/validation"
import db from "../Database"

const insertValidation = async (
  uid: string,
  user_id: string,
  synced: boolean,
  created_at: number,
  updated_at: number
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO validations (
          uid,
          user_id,
          synced,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?);`,
        [uid, user_id, 0, created_at, updated_at],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId)
          else reject("Erro ao registrar validação")
        },
        (_, error) => {
          reject(error)
          return false
        }
      )
    })
  })
}

const updateValidation = async (ticketUid: string, synced: boolean): Promise<IValidation[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE validations SET synced = ? WHERE uid = ?;",
        [synced ? 1 : 0, ticketUid],
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

const searchByTicket = async (ticketUid: string): Promise<IValidation[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM validations WHERE uid = ?;",
        [ticketUid],
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

const getAll = async (): Promise<IValidation[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM validations;",
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

const getValidationsNoSync = async (): Promise<IValidation[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM validations WHERE synced = 0;",
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

const Validation = {
  insertValidation,
  updateValidation,
  searchByTicket,
  getAll,
  getValidationsNoSync,
}

export default Validation
