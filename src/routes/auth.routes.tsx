import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { SignIn } from "@screens/SignIn"
import useStore from "../store"
import { AppNavigatiorRoutesProps, AppRoutes } from "./app.routes"
import { useCallback, useEffect, useState } from "react"
import { getData, setData } from "../store/reducers/persistorReducer"
import { EventData } from "@utils/@types/data/event"
import { UserInfo } from "@utils/@types/data/user"
import { useNavigation } from "@react-navigation/native"

export type Routes = "signIn" | "appNavigator"

type AuthRoutes = {
  [r in Routes]: undefined
}

export type AuthNavigatiorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export function AuthRoutes() {
  const navigation = useNavigation<AppNavigatiorRoutesProps>()
  const authNavigation = useNavigation<AuthNavigatiorRoutesProps>()

  const { user: storeUser, currentEvent } = useStore((state) => state)

  const [user, setUser] = useState(!!storeUser)
  const [canRender, setCanRender] = useState(false)

  const checkUser = useCallback(async () => {
    if (!user) {
      if (storeUser) {
        setUser(true)
        if (currentEvent) {
          navigation.reset({
            index: 0,
            routes: [{ name: "home" }],
          })
        }
      } else {
        authNavigation.reset({
          index: 0,
          routes: [{ name: "signIn" }],
        })
      }
      setCanRender(true)
    }
  }, [storeUser, currentEvent])

  useEffect(() => {
    setUser(false)
    checkUser()
  }, [checkUser])

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
