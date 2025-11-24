import db from "@services/sqlite/Database"
import { insertCombo as insertComboQuery } from "@services/sqlite/queries/combos"
import { ICombo } from "@utils/@types/sqlite/combo"

export const insertCombo = async (combo: ICombo) => {
  try {
    const result = await db.runAsync(insertComboQuery, [
      combo.id,
      combo.oid,
      combo.favorite,
      combo.org_id,
      combo.name,
      combo.image,
      combo.description1,
      combo.description2,
      combo.ticket_type,
      combo.price_sell,
      combo.status,
      combo.direction,
      combo.print_qrcode,
      combo.print_ticket,
      combo.print_local,
      combo.print_date,
      combo.print_value,
      (combo.created_at as string) ?? new Date().getTime(),
      (combo.updated_at as string) ?? new Date().getTime(),
      combo.group_id,
      combo.archived ?? 0,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const insertCombos = async (list: ICombo[]) => {
  for (let i = 0; i < list.length; i++) {
    const combo = list[i]
    try {
      await insertCombo(combo)
    } catch (error) {
      console.error("Error inserting combo:", error)
    }
  }
  return true
}
