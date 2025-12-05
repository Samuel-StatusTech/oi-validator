import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiUsers } from ".."
import { api } from "src/api"

export type TApiParams_Users_UploadData = {
  orders: any[]
  products: any[]
  operations: any[]
}

export type TApiResponse_Users_UploadData = {
  orderSuccess: any[]
  validationSuccess: any[]
}

export const uploadData: TApiUsers["uploadData"] = async (data) => {
  let res: TDefaultApiRes<TApiResponse_Users_UploadData> = {
    ok: false,
    message: "",
  }

  try {
    const upload = await api.post("/sync/v2-1/upload", {
      orders: data.orders,
      products: data.products,
      operations: data.operations,
    })

    if (upload.status === 200)
      res = {
        ok: await upload.data.success,
        data: await upload.data,
      }
  } catch (error) {
    res = {
      ok: false,
      message: "Houve um erro. Tente novamente mais tarde",
    }
  }

  return res
}
