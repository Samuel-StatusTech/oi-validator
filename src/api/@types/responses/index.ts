export type TDefaultApiRes<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      message: string
    }
