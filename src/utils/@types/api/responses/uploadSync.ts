export type UploadSyncRes =
  | {
      ok: true
      data:
        | {
            orderSuccess: any[]
            validationSuccess: any[]
          }
        | any
    }
  | {
      ok: false
      message: string
    }
