import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { StoreInterface } from "@utils/@types/store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import UserReducer from "./reducers/User"
import TokenReducer from "./reducers/Token"
import CommonReducer from "./reducers/Common"
import { THEME } from "src/theme"

const useStore = create<StoreInterface>()(
  persist(
    (set, get) => ({
      user: null,
      token: "",
      lastSync: 0,
      currentEvent: null,
      mustSync: false,
      headerColor: THEME.colors.gray[50],
      cameraFacing: "back" as "front" | "back",
      feedbackDuration: 2.5,
      screenLockTimeout: 45,
      // ...useReducers(set),

      User: UserReducer(set),
      Token: TokenReducer(set),
      Common: CommonReducer(set),
    }),
    {
      name: "oi-validator-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize(state) {
        return {
          user: state.user,
          token: state.token,
          lastSync: state.lastSync,
          currentEvent: state.currentEvent,
          mustSync: state.mustSync,
          headerColor: state.headerColor,
          cameraFacing: state.cameraFacing,
          feedbackDuration: state.feedbackDuration,
          screenLockTimeout: state.screenLockTimeout,
        }
      },
    }
  )
)

export default useStore
