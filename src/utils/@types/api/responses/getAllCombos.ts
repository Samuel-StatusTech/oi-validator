import { ICombo } from "@utils/@types/sqlite/combo"

export type AllCombosRes =
  | {
      ok: true
      data: ICombo[]
    }
  | {
      ok: false
      message: string
    }
