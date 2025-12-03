import { SyncHelperRes } from "@utils/@types/api/responses/syncHelper"
import useStore from "../../store"
import Api from "@utils/api"
import Validation from "@services/sqlite/models/Validation"
import { IProduct } from "@utils/@types/sqlite/product"
import { IValidation } from "@utils/@types/sqlite/validation"

export const syncValidations = async (data?: {
  orders?: any[]
  products?: IProduct[]
  validations: IValidation[]
  operations?: any[]
  token?: string
}): Promise<SyncHelperRes> => {
  let res: SyncHelperRes = { ok: true, message: "" }

  try {
    const store = useStore()

    const Common = store.Common

    const token = store.token
    const event = store.currentEvent
    const user = store.user

    if (token && event) {
      const onlineValidations = await Api.getOnlineValidations(
        event?.id as string,
        token
      )
      if (onlineValidations.ok) {
        const localValidations = await Validation.getAll()
        onlineValidations.data.forEach(async (val) => {
          const localMatch = localValidations.find((lv) => lv.uid === val.uid)
          if (localMatch && !Boolean(localMatch.synced)) {
            await Validation.updateValidation(localMatch.uid, true)
          } else if (!localMatch && val.user_id === user?.id) {
            await Validation.insertValidation(
              val.uid,
              user?.id,
              true,
              new Date(val.created_at).getTime(),
              new Date(val.updated_at).getTime()
            )
          }
        })
      }

      // const localNoSyncValidations = await Validation.getValidationsNoSync()

      const now = new Date().getTime()
      const uploadReq = await Api.uploadSync({
        orders: data?.orders || [],
        products: data?.products || [],
        operations: data?.operations || [],
        token: data?.token || token,
      })

      if (!uploadReq.ok) {
        throw new Error("Upload sync failed")
      }

      const validations: IValidation[] = uploadReq.data.validations

      if (validations) {
        const validationsIds: string[] = [
          ...new Set(validations.map((v) => v.uid)),
        ]

        await Validation.updateValidations(validationsIds)
      }

      Common.setLastSync(now)
      Common.setSyncObligation(false)
      res = { ok: true, message: "Validações sincronizadas com sucesso" }
    } else {
      res = { ok: false, message: "Não autorizado" }
    }
  } catch (error) {
    res = { ok: false, message: "Não foi possível sincronizar as validações" }
  }

  return res
}
