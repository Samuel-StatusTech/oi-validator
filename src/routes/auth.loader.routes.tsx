import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import useStore from "../store"
import { AppNavigatiorRoutesProps } from "./app.routes"
import { useCallback, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { ActivityIndicator, Image, View } from "react-native"

import logo from "../../assets/logo_.png"

export type Routes = "signIn" | "appNavigator"

type AuthRoutes = {
  [r in Routes]: undefined
}

export type AuthNavigatiorRoutesProps = NativeStackNavigationProp<AuthRoutes>

export function AuthLoader() {
  const navigation = useNavigation<AppNavigatiorRoutesProps>()
  const authNavigation = useNavigation<AuthNavigatiorRoutesProps>()

  const { user: storeUser, currentEvent } = useStore((state) => state)

  const checkUser = useCallback(async () => {
    try {
      if (!navigation) return

      if (storeUser) {
        if (currentEvent) {
          authNavigation.reset({
            index: 0,
            routes: [{ name: "appNavigator", path: "home" }],
          })
        } else {
          authNavigation.reset({
            index: 0,
            routes: [{ name: "appNavigator", path: "selectEvent" }],
          })
        }
      } else {
        authNavigation.reset({
          index: 0,
          routes: [{ name: "signIn" }],
        })
      }
    } catch (error) {
      console.log("Error checking user:", error)
    }
  }, [storeUser, currentEvent, navigation])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        width: "100%",
        padding: 16,
      }}
    >
      <Image source={logo} style={{ width: 180, height: 60 }} />
      <ActivityIndicator style={{ width: 48 }} color={"#0097FE"} />
    </View>
  )
}
