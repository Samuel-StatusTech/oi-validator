export const insertValidation = `
  INSERT INTO validations (
    uid,
    user_id,
    synced,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?);
`;

export const updateValidation = `
  UPDATE validations SET synced = ? WHERE uid = ?;
`;

export const updateValidations = `
  UPDATE validations SET synced = ? WHERE uid IN [?];
`;

export const selectValidationByUid = `
  SELECT * FROM validations WHERE uid = ?;
`;

export const selectAllValidations = `
  SELECT * FROM validations;
`;

export const selectValidationsNoSync = `
  SELECT * FROM validations WHERE synced = 0;
`;
