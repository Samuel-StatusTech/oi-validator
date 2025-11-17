export const insertCombo = `
  INSERT INTO combos (
    id,
    oid,
    favorite,
    org_id,
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
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const selectAllCombos = `
  SELECT * FROM combos;
`;
