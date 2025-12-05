import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiAuth } from ".."
import { api } from "src/api"

export type TApiParams_Auth_GetMachData = {
  imei: number
}

export type TApiResponse_Auth_GetMachData = {
  name: string
  imei: string
  code: number
  app_code: number
  status: number
  created_at: string
  updated_at: string
  org_id: string
  archived: number
  order_prefix: string
}

export const getMachData: TApiAuth["getMachData"] = async ({ imei }) => {
  let res: TDefaultApiRes<TApiResponse_Auth_GetMachData> = {
    ok: false,
    message: "",
  }

  try {
    const req = await (await api.get(`/device/getDataByImei/${imei}`)).data

    if (req.imei) {
      res = {
        ok: true,
        data: { ...req },
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
