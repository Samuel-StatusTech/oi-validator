import { TDefaultApiRes } from "../@types/responses"
import {
  getValidatorData,
  TApiParams_Users_GetValidatorData,
  TApiResponse_Users_GetValidatorData,
} from "./requests/getValidatorData"
import {
  syncUser,
  TApiParams_Users_SyncUser,
  TApiResponse_Users_SyncUser,
} from "./requests/syncUser"
import {
  TApiParams_Users_UploadData,
  TApiResponse_Users_UploadData,
  uploadData,
} from "./requests/uploadData"

export const ApiUsers: TApiUsers = {
  getValidatorData: getValidatorData,
  syncUser: syncUser,
  uploadData: uploadData,
}

export type TApiUsers = {
  getValidatorData: (
    params: TApiParams_Users_GetValidatorData
  ) => Promise<TDefaultApiRes<TApiResponse_Users_GetValidatorData>>
  syncUser: (
    params: TApiParams_Users_SyncUser
  ) => Promise<TDefaultApiRes<TApiResponse_Users_SyncUser>>
  uploadData: (
    params: TApiParams_Users_UploadData
  ) => Promise<TDefaultApiRes<TApiResponse_Users_UploadData>>
}
