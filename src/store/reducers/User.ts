import { Setter } from "../../utils/@types/store"
import { UserInfo } from "../../utils/@types/data/user"
import { SyncInfo } from "@utils/@types/api/responses/syncUser"
import { deleteData, getData, setData } from "./persistorReducer"

const UserReducer = (set: Setter) => {
  return {
    storeInfo: (userInfo: UserInfo) =>
      set((state) => {
        setData("user", JSON.stringify(userInfo))

        return {
          ...state,
          user: {
            ...state.user,
            ...userInfo,
          },
        }
      }),
    storeSyncInfo: (syncInfo: SyncInfo) =>
      set((state) => {
        return {
          ...state,
          user: {
            ...state.user as any,
            kInfo: syncInfo,
          },
        }
      }),
    cleanInfo: () =>
      set((state) => {
        deleteData("user")

        return {
          ...state,
          user: null,
        }
      }),
  }
}

export default UserReducer
