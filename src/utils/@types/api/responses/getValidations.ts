import { IValidation } from "@utils/@types/sqlite/validation"

export type GetValidationsRes =
  | {
      ok: true
      data: IValidation[]
    }
  | {
      ok: false
      message: string
    }
