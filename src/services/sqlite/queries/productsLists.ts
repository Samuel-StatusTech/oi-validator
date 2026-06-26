export const insertProductList = `
  INSERT INTO product_lists (
    id,
    list_id,
    pdv_id,
    user_id,
    reservation_id,
    combo_id,
    quantity
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
`

export const selectAllProductLists = `
  SELECT * FROM product_lists;
`

export const selectProductListsByUser = `
  SELECT * FROM product_lists WHERE user_id = ?;
`

export const selectProductListByProductId = `
  SELECT * FROM product_lists WHERE id = ? LIMIT 1;
`

export const selectProductListsByProductId = `
  SELECT * FROM product_lists WHERE id = ?;
`

export const deleteAllProductLists = `DELETE FROM product_lists;`

export const updateProductList = `
  UPDATE product_lists SET
    list_id = ?,
    pdv_id = ?,
    user_id = ?,
    reservation_id = ?,
    combo_id = ?,
    quantity = ?
  WHERE id = ?;
`
