export const insertValidation = `
  INSERT INTO validations (
    uid,
    user_id,
    synced,
    created_at,
    updated_at,
    ticketProductId,
    ticketReadableCode
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
`

export const insertOrReplaceValidationQuery = `
  INSERT OR REPLACE INTO validations (
    uid,
    user_id,
    synced,
    created_at,
    updated_at,
    ticketProductId,
    ticketReadableCode
  ) VALUES (?, ?, ?, ?, ?, ?, ?);
`

export const updateValidation = `
  UPDATE validations SET synced = ? WHERE uid = ?;
`

export const updateValidations = `
  UPDATE validations SET synced = ? WHERE uid IN [?];
`

export const selectValidationByUid = `
  SELECT * FROM validations WHERE uid = ?;
`

export const selectValidationByReadableCode = `
  SELECT * FROM validations WHERE ticketReadableCode = ? OR uid = ?;
`

export const selectAllValidations = `
  SELECT * FROM validations;
`

export const selectAllUsersValidations = `
  SELECT * FROM validations WHERE user_id = ?;
`

export const selectValidationsNoSync = `
  SELECT * FROM validations WHERE synced = 0;
`
