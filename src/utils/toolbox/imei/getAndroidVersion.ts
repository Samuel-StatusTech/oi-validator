import { Platform } from "react-native"

export const getAndroidVersion = () => {
  return Platform.OS === "android"
    ? parseInt(String(Platform.Version), 10)
    : null
}
