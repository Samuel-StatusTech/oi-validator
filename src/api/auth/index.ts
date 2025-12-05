import { TDefaultApiRes } from "../@types/responses"
import {
  authenticate,
  TApiParams_Auth_Authenticate,
  TApiResponse_Auth_Authenticate,
} from "./requests/authenticate"
import {
  getDataBase,
  TApiParams_Auth_GetDatabase,
  TApiResponse_Auth_GetDatabase,
} from "./requests/getDatabase"
import {
  getMachData,
  TApiParams_Auth_GetMachData,
  TApiResponse_Auth_GetMachData,
} from "./requests/getMachData"

export const ApiAuth: TApiAuth = {
  getDatabase: getDataBase,
  authenticate: authenticate,
  getMachData: getMachData,
}

export type TApiAuth = {
  getDatabase: (
    params: TApiParams_Auth_GetDatabase
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_GetDatabase>>
  authenticate: (
    params: TApiParams_Auth_Authenticate
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_Authenticate>>
  getMachData: (
    params: TApiParams_Auth_GetMachData
  ) => Promise<TDefaultApiRes<TApiResponse_Auth_GetMachData>>
}
