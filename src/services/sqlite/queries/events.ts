export const insertEvent = `
  INSERT INTO events (
    id, org_id, name, description, logo, logo_print, date_ini, time_ini, date_end,
    local, city, state, days, status, print_valid, print_logo, has_cashless,
    has_tax_active, allow_cashback, has_tax_cashback, tax_active, tax_payback_cash,
    tax_payback_percent, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
