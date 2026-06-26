import db from "@services/sqlite/Database"
import { selectAllCombos, selectComboById } from "@services/sqlite/queries/combos"
import { ICombo } from "@utils/@types/sqlite/combo"

export const getAllCombos = async (): Promise<ICombo[]> => {
  try {
    const result = await db.getAllAsync<ICombo>(selectAllCombos)
    return result
  } catch (error) {
    throw error
  }
}

export const getComboById = async (comboId: string): Promise<ICombo | null> => {
  try {
    const result = await db.getFirstAsync<ICombo>(selectComboById, [comboId])
    return result ?? null
  } catch (error) {
    return null
  }
}
