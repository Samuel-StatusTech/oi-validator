import { ICombo } from "@utils/@types/sqlite/combo"
import { IProduct } from "@utils/@types/sqlite/product"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

export type AllProductsRes =
  | {
      ok: true
      data: IProduct[]
    }
  | {
      ok: false
      message: string
    }
