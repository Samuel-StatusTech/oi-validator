import { create } from "zustand"
import { StoreInterface } from "@utils/@types/store"
import useReducers from "./reducers"

const useStore = create<StoreInterface>()((set) => ({
  user: null,
  token: "",
  lastSync: 0,
  currentEvent: null,
  mustSync: false,
  headerColor: "#0097FE",
  ...useReducers(set),
}))

export default useStore
