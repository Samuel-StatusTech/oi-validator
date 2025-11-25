import { NativeModules } from "react-native"
import DeviceInfo from "react-native-device-info"
import { getAndroidVersion } from "./getAndroidVersion"

const { ImeiModule, StringToBigIntConverterModule } = NativeModules

export const getImeiOrUnique = async () => {
  try {
    const androidVersion = getAndroidVersion()

    let code = null

    if (androidVersion !== null) {
      if (androidVersion < 29) {
        const imei = await ImeiModule.getImei()
          .then((res: any) => res)
          .catch((err: any) => "000")

        code = imei
      } else {
        const newestNumber = await DeviceInfo.getAndroidId()

        const convertedValue =
          await StringToBigIntConverterModule.convertStringToNumber(
            newestNumber
          )

        code = convertedValue
      }
    }

    return code
  } catch (error) {
    console.log(error)
    return ""
  }
}
