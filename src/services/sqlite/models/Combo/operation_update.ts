import db from "@services/sqlite/Database"
import { updateCombo as updateComboQuery } from "../../queries/combos"
import { ICombo } from "@utils/@types/sqlite/combo"
import { buildUpdateParams } from "@utils/toolbox/dbHelpers"
import { safeTransactions } from "@services/sqlite/safeTransactions"

export const updateCombo = async (combo: ICombo) => {
  try {
    const result = await db.runAsync(updateComboQuery, [
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
      combo.id,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}

export const updateCombos = async (combos: ICombo[]) => {
  if (!combos?.length) return true

  try {
    const transactionResult = await safeTransactions(
      updateComboQuery,
      combos,
      buildUpdateParams.combo
    )

    return transactionResult
  } catch (error) {
    console.log("Error updating combos:", error)
    return false
  }
}
