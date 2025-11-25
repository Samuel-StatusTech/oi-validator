import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { SignIn } from "@screens/SignIn"
import { AppRoutes } from "./app.routes"
import { AuthLoader } from "./auth.loader.routes"

export type Routes = "authLoading" | "signIn" | "appNavigator"

type AuthRoutes = {
  [r in Routes]: undefined
}

export type AuthNavigatiorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"authLoading"}
    >
      <Screen name="authLoading" component={AuthLoader} />
      <Screen name="signIn" component={SignIn} />
      <Screen name="appNavigator" component={AppRoutes} />
    </Navigator>
  )
}
