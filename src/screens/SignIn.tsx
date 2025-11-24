import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native"
import { THEME } from "../theme"
import Logo from "@assets/logo.svg"
import { Button } from "@components/Button"
import { Input } from "@components/Input"
import { MaterialIcons } from "@expo/vector-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps } from "@routes/auth.routes"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as yup from "yup"
import Api from "@utils/api"
import { PermissionsAndroid } from "react-native"
import useStore from "../store"
import { UserInfo } from "@utils/@types/data/user"
import { storeDbUserInfo } from "@utils/toolbox/auxFns/storeDbUserInfo"
import { useNetInfo } from "@react-native-community/netinfo"
import {
  getData,
  getIMEI,
  setData,
  setIMEI,
} from "../store/reducers/persistorReducer"
import { generateNumber } from "@utils/toolbox/auxFns/generateNumber"
import { PopUp } from "@components/PopUp"
import Validation from "@services/sqlite/models/Validation"

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
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  })

  async function handleSignIn() {
    setIsLoading(true)

    const { name, password } = control._formValues

    const db = await Api.getDatabase(imei)

    if (db.ok) {
      const auth = await Api.authenticate(name, password, db.data.client)

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
        await setData("user", JSON.stringify(userInfo))
        await setData("token", auth.data.token)

        const sync = await Api.syncUser(
          userInfo.org_id,
          userInfo.id,
          null,
          0,
          auth.data.token
        )

        if (sync.ok) {
          const fullData = {
            ...userInfo,
            kInfo: sync.data,
          }
          if (sync.data.lastSyncServer) {
            store.Common.setLastSync(sync.data.lastSyncServer)
            const lastSync = await Api.syncUser(
              userInfo.org_id,
              userInfo.id,
              null,
              sync.data.lastSyncServer,
              auth.data.token
            )

            if (lastSync.ok) {
              store.User.storeSyncInfo(sync.data)
              storeDbUserInfo(sync.data, "start").then(async () => {
                // pegar validações
                const onlineValidations = await Api.getOnlineValidations(
                  store.currentEvent?.id as string,
                  store.token
                )
                // para cada uma, verificar se há um registro local
                if (onlineValidations.ok) {
                  const localValidations = await Validation.getAll()
                  onlineValidations.data.forEach(async (val) => {
                    const localMatch = localValidations.find(
                      (lv) => lv.uid === val.uid
                    )
                    // para aquelas que estiverem registradas localmente, atualizar campo 'sync'
                    if (localMatch && !Boolean(localMatch.synced)) {
                      await Validation.updateValidation(localMatch.uid, true)
                    } else if (!localMatch && val.user_id === store.user?.id) {
                      // para aquelas que não, registrar
                      await Validation.insertValidation(
                        val.uid,
                        store.user?.id as string,
                        true,
                        new Date(val.created_at).getTime(),
                        new Date(val.updated_at).getTime()
                      )
                    }
                  })
                }
              })
            }
          }

          store.User.storeSyncInfo(sync.data)
          storeDbUserInfo(fullData.kInfo)
          await setData("user", JSON.stringify(fullData))
        } else {
          setAuthError({ ...authError, pass: true, name: true })
        }

        const machData = await Api.getMachData(imei, auth.data.token)
        if (machData.ok) {
          setIsLoading(false)
          navigation.reset({
            index: 0,
            routes: [{ name: "appNavigator" }],
          })
        } else {
          setAuthError({ ...authError, pass: true, name: true })
        }

        setIsAuthenticating(false)
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
    const persistedIMEI = await getIMEI()

    if (persistedIMEI) setImei(Number(persistedIMEI))
    else {
      const n = generateNumber()
      setIMEI(n)
      setImei(n)
    }
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
    } else {
      getData("lastSync").then((pSync) => {
        if (pSync) {
          setSyncText(`Última sincronização:   ${getDateStr(pSync as number)}`)
        }
      })
    }
  }, [])

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.center}>
            <Logo />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Usuário"
                  autoCapitalize="none"
                  value={value}
                  isInvalid={authError.name}
                  onChangeText={(v) => {
                    onChange(v)
                    if (authError.name) removeError("name")
                  }}
                  returnKeyType="next"
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
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
                  returnKeyType="send"
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
                (control._formValues.username &&
                  control._formValues.username.trim().length === 0) ||
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
              <Text style={styles.syncText}>
                {isAuthenticating ? "Sincronizando..." : syncText ?? ""}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.imeiText}>{imei ? `IMEI: ${imei}` : ""}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
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
    textAlign: "right",
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
