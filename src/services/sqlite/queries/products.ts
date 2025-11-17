export const insertProduct = `
  INSERT INTO products (
    id,
    o_id,
    org_id,
    name,
    image,
    status,
    type,
    group_id,
    warehouse_type,
    description1,
    description2,
    has_variable,
    has_courtesy,
    has_control,
    has_cut,
    has_tolerance,
    print_qrcode,
    print_ticket,
    print_local,
    print_date,
    print_value,
    print_group,
    print_plate,
    print_tolerance,
    price_cost,
    price_sell,
    quantity,
    start_at,
    number_copy,
    time_tolerance,
    value_tolerance,
    created_at,
    updated_at,
    synced,
    archived
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const selectAllProducts = `
  SELECT * FROM products;
`;

export const selectProductsByType = `
  SELECT * FROM products WHERE type IN (?);
`;

export const selectProductsNoSync = `
  SELECT * FROM products WHERE synced = 0;
`;
