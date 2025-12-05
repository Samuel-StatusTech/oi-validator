import axios from "axios"

/* Functions Returns */
import { SyncUserRes } from "@utils/@types/api/responses/syncUser"
import { UploadSyncRes } from "@utils/@types/api/responses/uploadSync"
import { ValidatorDataRes } from "@utils/@types/api/responses/getValidator"

/* Models */
import useStore from "src/store"
import { TApi } from "./@types"
import { ApiAuth } from "./auth"
import { ApiValidations } from "./validations"
import { ApiTickets } from "./tickets"

export const api = axios.create({
  baseURL: "https://api.oitickets.com.br/api/v1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})

api.interceptors.request.use((req) => {
  const token = useStore.getState().token
  req.headers.Authorization = `Bearer ${token}`

  return req
})

const getValidatorData = async (userId: string): Promise<ValidatorDataRes> => {
  let res: ValidatorDataRes = { ok: false, message: "" }

  try {
    const req = await (await a.get(`/validator/getData/${userId}`)).data

    if (req.success && req.validator) {
      res = {
        ok: true,
        data: { validator: req.validator, products: req.products },
      }
    } else {
      res.message = req ?? ""
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}

const syncUser = async (
  orgId: string,
  userId: string,
  eventId: null | string,
  lastSync: number,
  token: string
): Promise<SyncUserRes> => {
  let res: SyncUserRes = { ok: false, message: "" }

  try {
    const req = await a.get(`/sync/v2-1/download`, {
      params: {
        org_id: orgId,
        user_id: userId,
        lastSync,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (req.status === 200) {
      const sync = await req.data
      res = {
        ok: true,
        data: sync,
      }
    }

    if (eventId && res.ok) {
      const req2 = await na
        .get(`/ecommerce/product/getList?eventId=${eventId}`)
        .catch((err) => err)

      if (req2.status === 200) {
        const sync = req2.data

        if (sync && res.ok) {
          res = {
            ok: true,
            data: {
              ...res.data,
              productsData: {
                ...res.data.productsData,
                webstore_tickets: sync,
              },
            },
          }
        }
      }
    }
  } catch (error) {
    console.log("Error", error)
  }

  return res
}

const uploadSync = async (data: {
  orders: any[]
  products: any[]
  operations: any[]
  token: string
}): Promise<UploadSyncRes> => {
  let res: UploadSyncRes = { ok: false, message: "" }

  try {
    const upload = await a.post(
      "/sync/v2-1/upload",
      {
        orders: data.orders,
        products: data.products,
        operations: data.operations,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )

    if (upload.status === 200)
      res = {
        ok: await upload.data.success,
        data: await upload.data,
      }
  } catch (error) {}

  return res
}

const Api: TApi = {
  auth: ApiAuth,
  validations: ApiValidations,
  tickets: ApiTickets,
}

export default Api
