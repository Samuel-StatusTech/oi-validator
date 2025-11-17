export const selectAllUsers = `
  SELECT * FROM users;
`;

export const selectUserOperators = `
  SELECT * FROM user_operators;
`;

export const selectUserValidators = `
  SELECT * FROM user_validators;
`;

export const selectWaiterByCode = `
  SELECT * FROM waiters WHERE code LIKE ?;
`;
