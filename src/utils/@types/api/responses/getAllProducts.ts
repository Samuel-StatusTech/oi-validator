import { IProduct } from "@utils/@types/sqlite/product"

export type AllProductsRes =
  | {
      ok: true
      data: IProduct[]
    }
  | {
      ok: false
      message: string
    }
