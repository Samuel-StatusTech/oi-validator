import { ICombo } from "@utils/@types/sqlite/combo"
import db from "../Database"
import { insertCombo, selectAllCombos } from "../queries/combos"

const insertCombos = async (list: ICombo[]) => {
  for (let i = 0; i < list.length; i++) {
    const c = list[i]
    try {
      await db.runAsync(insertCombo, [
        c.id,
        c.oid,
        c.favorite,
        c.org_id,
        c.name,
        c.image,
        c.description1,
        c.description2,
        c.ticket_type,
        c.price_sell,
        c.status,
        c.direction,
        c.print_qrcode,
        c.print_ticket,
        c.print_local,
        c.print_date,
        c.print_value,
        c.created_at as string ?? new Date().getTime(),
        c.updated_at as string ?? new Date().getTime(),
        c.group_id,
        c.archived ?? 0
      ]);
    } catch (error) {
      console.error("Error inserting combo:", error);
    }
  }
  return true;
}

const getAllCombos = async (): Promise<ICombo[]> => {
  try {
    const result = await db.getAllAsync<ICombo>(selectAllCombos);
    return result;
  } catch (error) {
    throw error;
  }
}

const Combo = {
  insertCombos,
  getAllCombos,
}

export default Combo
