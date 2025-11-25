import { Setter } from "../../utils/@types/store"
import { deleteData, setData } from "./persistorReducer"

const TokenReducer = (set: Setter) => {
  return {
    storeToken: (token: string) =>
      set((state) => {

        return {
          ...state,
          token,
        }
      }),
    deleteToken: () =>
      set((state) => {

        return {
          ...state,
          token: "",
        }
      }),
  }
}

export default TokenReducer
