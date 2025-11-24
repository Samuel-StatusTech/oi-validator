import db from "./Database"

export const safeTransactions = async (
  statementQuery: string,
  transactions: any[],
  parser?: (params: any) => any[]
) => {
  if (!transactions.length) return true

  try {
    await db.runAsync("BEGIN TRANSACTION")

    const stmt = await db.prepareAsync(statementQuery)

    for (const transaction of transactions) {
      await stmt.executeAsync(parser ? parser(transaction) : transaction)
    }

    await stmt.finalizeAsync()

    await db.runAsync("COMMIT")

    return true
  } catch (error) {
    await db.runAsync("ROLLBACK")
    throw error
  }
}
