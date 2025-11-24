export const insertEvent = `
  INSERT INTO events (
    id,
    oid,
    name,
    description,
    local,
    status,
    org_id,
    date_ini,
    time_ini,
    date_end,
    date,
    logo,
    logo_print,
    print_valid,
    print_logo,
    days,
    has_cashless,
    has_tax_active,
    allow_cashback,
    has_tax_cashback,
    tax_active,
    tax_payback_cash,
    tax_payback_percent,
    order_number,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`

export const updateEvent = `
  UPDATE events SET
    oid = ?,
    name = ?,
    description = ?,
    local = ?,
    status = ?,
    org_id = ?,
    date_ini = ?,
    time_ini = ?,
    date_end = ?,
    date = ?,
    logo = ?,
    logo_print = ?,
    print_valid = ?,
    print_logo = ?,
    days = ?,
    has_cashless = ?,
    has_tax_active = ?,
    allow_cashback = ?,
    has_tax_cashback = ?,
    tax_active = ?,
    tax_payback_cash = ?,
    tax_payback_percent = ?,
    order_number = ?,
    updated_at = ?
  WHERE id = ?;
`
