import { buildEventInsertParams } from "./buildInsertParams/event"
import { buildProductInsertParams } from "./buildInsertParams/product"
import { buildComboInsertParams } from "./buildInsertParams/combo"
import { buildProductsListInsertParams } from "./buildInsertParams/productsList"
import { buildWebstoreTicketsInsertParams } from "./buildInsertParams/webstoreTicket"

import { buildEventUpdateParams } from "./buildUpdateParams/event"
import { buildProductUpdateParams } from "./buildUpdateParams/product"
import { buildComboUpdateParams } from "./buildUpdateParams/combo"
import { buildProductsListUpdateParams } from "./buildUpdateParams/productsList"
import { buildWebstoreTicketsUpdateParams } from "./buildUpdateParams/webstoreTicket"

export const buildInsertParams = {
  event: buildEventInsertParams,
  product: buildProductInsertParams,
  combo: buildComboInsertParams,
  productsList: buildProductsListInsertParams,
  webstoreTicket: buildWebstoreTicketsInsertParams,
}

export const buildUpdateParams = {
  event: buildEventUpdateParams,
  product: buildProductUpdateParams,
  combo: buildComboUpdateParams,
  productsList: buildProductsListUpdateParams,
  webstoreTicket: buildWebstoreTicketsUpdateParams,
}
