export const selectOperationsByEmployee = `
  SELECT * FROM operations WHERE employee_id = ?;
`;

export const selectOperationsNoSync = `
  SELECT * FROM operations WHERE synced = 0;
`;
