import { buildEventUpdateParams } from "./buildUpdateParams/event"
import { buildProductUpdateParams } from "./buildUpdateParams/product"
import { buildComboUpdateParams } from "./buildUpdateParams/combo"
import { buildProductsListUpdateParams } from "./buildUpdateParams/productsList"
import { buildWebstoreTicketsUpdateParams } from "./buildUpdateParams/webstoreTicket"

export const buildUpdateParams = {
  event: buildEventUpdateParams,
  product: buildProductUpdateParams,
  combo: buildComboUpdateParams,
  productsList: buildProductsListUpdateParams,
  webstoreTicket: buildWebstoreTicketsUpdateParams,
}
