import { ICombo } from "@utils/@types/sqlite/combo"

export const buildComboUpdateParams = (combo: ICombo) => [
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
  combo.id, // WHERE id = ?
]
