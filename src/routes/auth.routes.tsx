import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { SignIn } from "@screens/SignIn"
import useStore from "../store"
import { AppRoutes } from "./app.routes"
import { useEffect, useState } from "react"
import { getData, setData } from "../store/reducers/persistorReducer"
import { EventData } from "@utils/@types/data/event"
import { UserInfo } from "@utils/@types/data/user"

export type Routes = "signIn" | "appNavigator"

type AuthRoutes = {
  [r in Routes]: undefined
}

export type AuthNavigatiorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export function AuthRoutes() {
  const store = useStore((state) => state)
  const [user, setUser] = useState(false)
  const [canRender, setCanRender] = useState(false)

  const checkUser = async () => {
    if (!user) {
      if (store.user) {
        setUser(true)
      } else if (!store.user) {
        const persistedUser = await getData("user")
        if (persistedUser && typeof persistedUser === "object") {
          store.User.storeInfo(persistedUser as UserInfo)

          const token = await getData("token")
          const event = await getData("currentEvent")
          const lastS = await getData("lastSync")
          const mustS = await getData("mustSync")

          if (token) store.Token.storeToken(token as string)
          if (event) store.Common.registerEvent(event as EventData)
          if (lastS) setData("lastSync", String(lastS))
          if (mustS) store.Common.setSyncObligation(Boolean(mustS))
          setUser(true)
        } else {
          const persistedLastSync = await getData("lastSync")
          store.Common.setLastSync(persistedLastSync as number)
          store.Common.setLastSync(
            persistedLastSync ? (persistedLastSync as string) : undefined
          )
        }
      }
      setCanRender(true)
    }
  }
  useEffect(() => {
    setUser(false)
    checkUser()
  }, [])

  return canRender ? (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? "appNavigator" : "signIn"}
    >
      <Screen name="signIn" component={SignIn} />
      <Screen name="appNavigator" component={AppRoutes} />
    </Navigator>
  ) : null
}
