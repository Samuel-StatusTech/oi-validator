import { SQLiteStatement } from "expo-sqlite"
import db from "./Database"

export const safeTransactions = async (
  statementQuery: string,
  transactions: any[],
  parser?: (params: any) => any[]
) => {
  let result = false
  if (!transactions.length) return true

  let stmt: SQLiteStatement | null = null

  try {
    await db.runAsync("BEGIN TRANSACTION")

    stmt = await db.prepareAsync(statementQuery)

    for (const transaction of transactions) {
      await stmt.executeAsync(parser ? parser(transaction) : transaction)
    }

    await db.runAsync("COMMIT")

    result = true
  } catch (error) {
    await db.runAsync("ROLLBACK")
    result = false
  } finally {
    if (stmt) {
      await stmt.finalizeAsync()
    }
  }

  return result
}
