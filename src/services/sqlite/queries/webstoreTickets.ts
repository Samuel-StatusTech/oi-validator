export const insertWebTicket = `
  INSERT INTO webstoreTickets (
    product_id,
    group_id,
    name,
    image,
    created_at,
    updated_at,
    active
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
`

export const selectAllWebTickets = `
  SELECT * FROM webstoreTickets;
`

export const deleteAllWebTickets = `
  DELETE FROM webstoreTickets;
`

export const selectWebTicketsNoSync = `
  SELECT * FROM webstoreTickets WHERE synced = 0;
`

export const insertOrReplaceWebTicket = `
  INSERT OR REPLACE INTO webstoreTickets (
    product_id,
    group_id,
    name,
    image,
    created_at,
    updated_at,
    active
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
`

export const updateWebTicket = `
  UPDATE webstoreTickets SET
    group_id = ?,
    name = ?,
    image = ?,
    created_at = ?,
    updated_at = ?,
    active = ?
  WHERE product_id = ?;
`
