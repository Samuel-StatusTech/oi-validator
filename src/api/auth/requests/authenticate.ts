import { TDefaultApiRes } from "src/api/@types/responses"
import { TApiAuth } from ".."
import { api } from "src/api"

export type TApiParams_Auth_Authenticate = {
  username: string
  password: string
  db: string
}

export type TApiResponse_Auth_Authenticate = {
  token: string
  roleData: any
  user: any
}

export const authenticate: TApiAuth["authenticate"] = async ({
  username,
  password,
  db,
}) => {
  let res: TDefaultApiRes<TApiResponse_Auth_Authenticate> = {
    ok: false,
    message: "",
  }

  try {
    const req = await (
      await api.post(`/authenticate`, {
        username,
        password,
        database: db,
      })
    ).data

    if (req.success) {
      res = {
        ok: true,
        data: { ...req },
      }
    } else {
      res.message = req.error
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}
