export const selectOrdersNoSync = `
  SELECT * FROM orders WHERE synced = 0;
`;
