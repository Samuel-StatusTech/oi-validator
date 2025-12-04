import { TAllProducts } from "@utils/toolbox/auxFns/getUserProducts"

export type AllPdvAndWebstoreProductsRes =
  | {
      ok: true
      data: TAllProducts
    }
  | {
      ok: false
      message: string
    }
