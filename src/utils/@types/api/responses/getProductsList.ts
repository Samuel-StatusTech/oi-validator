import { IProductsList } from "@utils/@types/sqlite/productsList"

export type ProductsListRes =
  | {
      ok: true
      data: IProductsList[]
    }
  | {
      ok: false
      message: string
    }
