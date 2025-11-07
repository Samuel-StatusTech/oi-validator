import { Setter } from "../../utils/@types/store"
import { deleteData, setData } from "./persistorReducer"

const TokenReducer = (set: Setter) => {
  return {
    storeToken: (token: string) =>
      set((state) => {
        setData("token", token)

        return {
          ...state,
          token,
        }
      }),
    deleteToken: () =>
      set((state) => {
        deleteData("token")

        return {
          ...state,
          token: "",
        }
      }),
  }
}

export default TokenReducer
