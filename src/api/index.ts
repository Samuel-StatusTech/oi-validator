import axios from "axios"

/* Models */
import useStore from "src/store"
import { TApi } from "./@types"
import { ApiAuth } from "./auth"
import { ApiValidations } from "./validations"
import { ApiTickets } from "./tickets"
import { ApiUsers } from "./users"

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

const Api: TApi = {
  auth: ApiAuth,
  validations: ApiValidations,
  tickets: ApiTickets,
  users: ApiUsers,
}

export default Api
