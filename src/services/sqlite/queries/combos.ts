export const insertCombo = `
  INSERT OR REPLACE INTO combos (
    id,
    oid,
    favorite,
    org_id,
    type,
    name,
    image,
    description1,
    description2,
    ticket_type,
    price_sell,
    status,
    direction,
    print_qrcode,
    print_ticket,
    print_local,
    print_date,
    print_value,
    created_at,
    updated_at,
    group_id,
    archived
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

export const selectAllCombos = `
  SELECT * FROM combos;
`

export const selectComboById = `
  SELECT * FROM combos WHERE id = ? LIMIT 1;
`

export const updateCombo = `
  UPDATE combos SET
    oid = ?,
    favorite = ?,
    org_id = ?,
    type = ?,
    name = ?,
    image = ?,
    description1 = ?,
    description2 = ?,
    ticket_type = ?,
    price_sell = ?,
    status = ?,
    direction = ?,
    print_qrcode = ?,
    print_ticket = ?,
    print_local = ?,
    print_date = ?,
    print_value = ?,
    created_at = ?,
    updated_at = ?,
    group_id = ?,
    archived = ?
  WHERE id = ?;
`
