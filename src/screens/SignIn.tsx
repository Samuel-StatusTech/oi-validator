import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  ToastAndroid,
  Clipboard,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native"
import { THEME } from "../theme"
import Logo from "@assets/logo.svg"
import Logo2 from "@assets/logo_image.svg"
import { Button } from "@components/Button"
import { Input } from "@components/Input"
import { MaterialIcons } from "@expo/vector-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps } from "@routes/auth.routes"
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as yup from "yup"
import Api from "src/api"
import { PermissionsAndroid } from "react-native"
import useStore from "../store"
import { UserInfo } from "@utils/@types/data/user"
import { storeDbUserInfo } from "@utils/toolbox/auxFns/storeDbUserInfo"
import { useNetInfo } from "@react-native-community/netinfo"
import { PopUp } from "@components/PopUp"
import { getImeiOrUnique } from "@utils/toolbox/imei"
import { syncValidations } from "@services/sync/validations"
import { dropTables } from "@services/sqlite/Database"
import { LoadingOverlay } from "@components/LoadingOverlay"

type FormDataProps = {
  name: string
  password: string
}

const signInSchema = yup.object({
  name: yup.string().required("Informe o nome de usuário."),
  password: yup
    .string()
    .required("Informe sua senha.")
    .min(4, "A senha deve ter pelo menos 4 digitos."),
})

export function SignIn() {
  const connection = useNetInfo()
  const store = useStore((state) => state)

  const inputUsernameRef = useRef<TextInput | null>(null)
  const inputPassRef = useRef<TextInput | null>(null)

  const [imei, setImei] = useState(0)
  const [showPassword, setShowPassowrd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [popup, setPopup] = useState<{
    show: boolean
    success: boolean
    message: string
  }>({
    show: false,
    success: false,
    message: "",
  })
  const [authError, setAuthError] = useState<{
    name: boolean
    pass: boolean
  }>({
    name: false,
    pass: false,
  })
  const navigation = useNavigation<AuthNavigatiorRoutesProps>()

  const [syncText, setSyncText] = useState("")

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  })

  const clearData = async () => {
    try {
      await dropTables()
      store.User.cleanInfo()
      store.Token.deleteToken()
    } catch (error) {}
  }

  async function handleSignIn() {
    setIsLoading(true)

    try {
      const { name, password } = getValues()

      const db = await Api.auth.getDatabase({ imei })

      if (db.ok) {
        const auth = await Api.auth.authenticate({
          username: name,
          password: password,
          db: db.data.client,
        })

        if (auth.ok) {
          setIsAuthenticating(true)
          let product_types = []

          if (auth.data.roleData.has_bar) product_types.push("bar")
          if (auth.data.roleData.has_park) product_types.push("estacionamento")
          if (auth.data.roleData.has_ticket) product_types.push("ingresso")

          const userInfo: UserInfo = {
            ...auth.data.user,
            roleInfo: {
              ...auth.data.roleData,
              product_types,
            },
            db: db.data.client,
          }
          store.User.storeInfo(userInfo)
          store.Token.storeToken(auth.data.token)

          const sync = await Api.users.syncUser({
            orgId: userInfo.org_id,
            userId: userInfo.id,
            eventId: null,
            lastSync: 0,
          })

          if (sync.ok) {
            if (sync.data.lastSyncServer) {
              store.Common.setLastSync(sync.data.lastSyncServer)
              const lastSync = await Api.users.syncUser({
                orgId: userInfo.org_id,
                userId: userInfo.id,
                eventId: null,
                lastSync: sync.data.lastSyncServer,
              })

              if (lastSync.ok) {
                store.User.storeSyncInfo(sync.data)
                await storeDbUserInfo(sync.data, "start")
                await syncValidations()
              } else {
              }
            }
          } else {
            setAuthError({ ...authError, pass: true, name: true })
          }

          const machData = await Api.auth.getMachData({ imei })
          if (machData.ok) {
            setIsLoading(false)
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "appNavigator", path: "selectEvent" }],
              })
            }, 400)
            setIsAuthenticating(false)
          } else {
            setPopup({ show: true, success: false, message: machData.message })
            setAuthError({ ...authError, pass: true, name: true })

            await clearData()
            setIsLoading(false)
            setIsAuthenticating(false)
          }
        } else {
          if (auth.message.match(/(senha)+/gi)) {
            setAuthError({ ...authError, pass: true })
          } else if (auth.message.match(/(usuário)+/i)) {
            setAuthError({ ...authError, name: true })
          }

          setIsLoading(false)
        }
      } else {
        setPopup({ show: true, success: false, message: db.message })
        setIsLoading(false)
        throw new Error(db.message)
      }
    } catch (error) {
      setPopup({ show: true, success: false, message: JSON.stringify(error) })
      setIsLoading(false)

      await clearData()
    }
  }

  function removeError(field: "name" | "pass") {
    setAuthError({
      ...authError,
      [field]: false,
    })
  }

  function getDateStr(date: number) {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0"),
      month = String(d.getMonth() + 1).padStart(2, "0"),
      year = String(d.getFullYear())

    return `${day}/${month}/${year}`
  }

  async function proccessImei() {
    const newImei = await getImeiOrUnique()
    setImei(newImei)
  }

  useEffect(() => {
    PermissionsAndroid.check("android.permission.READ_PHONE_STATE").then(
      async (result) => {
        if (!result) {
          await PermissionsAndroid.requestMultiple([
            "android.permission.READ_PHONE_STATE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
            "android.permission.READ_EXTERNAL_STORAGE",
          ])
        }

        proccessImei()
      }
    )

    if (store.lastSync && store.lastSync > 0) {
      setSyncText(`Última sincronização:   ${getDateStr(store.lastSync)}`)
    }
  }, [])

  const handleCopyImei = useCallback(async () => {
    Clipboard.setString(String(imei))

    if (Platform.OS === "android") {
      ToastAndroid.show("Copiado!", ToastAndroid.SHORT)
    } else {
      Alert.alert("Copiado!", "O texto foi copiado para o clipboard.")
    }
  }, [imei])

  return (
    <>
      <PopUp
        title="Oops"
        description={popup.message}
        showing={popup.show}
        btnText="Fechar"
        close={() => setPopup({ show: false, success: false, message: "" })}
        action={() => setPopup({ show: false, success: false, message: "" })}
      />
      <LoadingOverlay visible={isAuthenticating} />
      <ScrollView
        contentContainerStyle={styles.containerWrapper}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.center}>
            <Logo width={"50%"} />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={inputUsernameRef}
                  placeholder="Usuário"
                  autoCapitalize="none"
                  value={value}
                  isInvalid={authError.name}
                  enterKeyHint="next"
                  onChangeText={(v) => {
                    onChange(v)
                    if (authError.name) removeError("name")
                  }}
                  onSubmitEditing={() => inputPassRef.current?.focus()}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={inputPassRef}
                  placeholder="Senha"
                  secureTextEntry={!showPassword}
                  onChangeText={(v) => {
                    onChange(v)
                    if (authError.pass) removeError("pass")
                  }}
                  value={value}
                  isInvalid={authError.pass}
                  errorMessage={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  enterKeyHint="next"
                  InputRightElement={
                    <Pressable onPress={() => setShowPassowrd(!showPassword)}>
                      <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color={THEME.colors.blue[500]}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            <Text style={styles.errorText}>
              {authError.name || authError.pass
                ? "Verifique seu login ou senha"
                : ""}
            </Text>

            <Button
              title="Entrar"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
              isDisabled={
                (control._formValues.name &&
                  control._formValues.name.trim().length === 0) ||
                (control._formValues.password &&
                  control._formValues.password.trim().length === 0) ||
                isAuthenticating ||
                !connection.isConnected
              }
            />
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color: connection.isConnected
                      ? THEME.colors.green[500]
                      : THEME.colors.red[500],
                  },
                ]}
              >
                {`Você está ${connection.isConnected ? "ONLINE" : "OFFLINE"}`}
              </Text>
              <Text style={styles.syncText}>{syncText ?? ""}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleCopyImei}
              style={styles.imeiPressArea}
            >
              <Text style={styles.imeiText}>{imei ? `IMEI: ${imei}` : ""}</Text>
              <MaterialIcons
                name="content-copy"
                size={20}
                color={THEME.colors.blue[200]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  containerWrapper: {
    flexGrow: 1,
    backgroundColor: THEME.colors.gray[700],
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  center: {
    marginVertical: 96,
    alignItems: "center",
  },
  errorText: {
    fontFamily: THEME.fonts.body,
    color: THEME.colors.red[500],
    fontSize: 14,
    width: "100%",
    paddingRight: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  statusContainer: {
    marginTop: 24,
  },
  statusText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: THEME.fonts.heading,
  },
  syncText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: THEME.fonts.body,
    color: THEME.colors.blue[200],
  },
  footer: {
    flex: 1,
    paddingBottom: 32,
    justifyContent: "flex-end",
  },
  imeiPressArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 4,
  },
  imeiText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: THEME.fonts.body,
    color: THEME.colors.blue[200],
  },
  textInput: {
    flex: 1,
  },
})
