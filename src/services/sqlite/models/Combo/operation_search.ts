import db from "@services/sqlite/Database"
import { selectAllCombos } from "@services/sqlite/queries/combos"
import { ICombo } from "@utils/@types/sqlite/combo"

export const getAllCombos = async (): Promise<ICombo[]> => {
  try {
    const result = await db.getAllAsync<ICombo>(selectAllCombos)
    return result
  } catch (error) {
    throw error
  }
}
