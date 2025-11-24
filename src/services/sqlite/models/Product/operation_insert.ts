import db from "@services/sqlite/Database"
import { insertProduct as insertProductQuery } from "@services/sqlite/queries/products"
import { IProduct } from "@utils/@types/sqlite/product"

export const insertProduct = async (product: IProduct) => {
  try {
    const result = await db.runAsync(insertProductQuery, [
      product.id,
      product.oid,
      product.org_id,
      product.name,
      product.image,
      product.status,
      product.type,
      product.group_id,
      product.warehouse_type,
      product.description1,
      product.description2,
      product.has_variable,
      product.has_courtesy,
      product.has_control,
      product.has_cut,
      product.has_tolerance,
      product.print_qrcode,
      product.print_ticket,
      product.print_local,
      product.print_date,
      product.print_value,
      product.print_group,
      product.print_plate,
      product.print_tolerance,
      product.price_cost,
      product.price_sell,
      product.quantity,
      product.start_at,
      product.number_copy,
      product.time_tolerance,
      product.value_tolerance,
      product.created_at,
      product.updated_at,
      1, // synced
      product.archived ?? 0,
    ])
    return result.lastInsertRowId
  } catch (error) {
    throw error
  }
}
export const insertProducts = async (list: IProduct[]) => {
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    try {
      await insertProduct(p)
    } catch (error) {
      console.error("Error inserting product:", error)
    }
  }
  return true
}
