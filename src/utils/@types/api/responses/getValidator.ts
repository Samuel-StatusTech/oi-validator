export type ValidatorDataRes =
  | {
      ok: true
      data: {
        validator: {
          id: string
          org_id: string
          username: string
          name: string
          email: null | string
          role: string
          status: number
          created_at: string
          updated_at: string
          phone: null | string
          photo: null | string
          user_id: string
          description: string
          has_bar: number
          has_ticket: number
          has_park: number
          has_product_list: number
          archived: number
        }
        products: {
          id: string
        }[]
      }
    }
  | {
      ok: false
      message: string
    }
