import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerNavigationProp,
} from "@react-navigation/drawer"
import AvailableProducts from "@screens/AvailableProducts"
import { Home } from "@screens/Home"
import { QrHistory } from "@screens/QrHistory"
import { SelectEvent } from "@screens/SelectEvent"
import { useState } from "react"
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { HStack, Spacer, Text, View, VStack } from "native-base"
import useStore from "../store"
import { useNavigation } from "@react-navigation/native"

import HomeIcon from "@assets/home.svg"
import ProdsIcon from "@assets/ajuda.svg"
import HistoryIcon from "@assets/historico.svg"
import SignOutIcon from "@assets/sair.svg"
import SyncIcon from "@assets/atualizar.svg"
import { Onlinetag } from "@components/OnlineTag"
import { useNetInfo } from "@react-native-community/netinfo"
import { PopUp } from "@components/PopUp"
import Api from "@utils/api"
import Validation from "@services/sqlite/models/Validation"
import Product from "@services/sqlite/models/Product"
import Operation from "@services/sqlite/models/Operations"
import Order from "@services/sqlite/models/Order"
import { setData } from "../store/reducers/persistorReducer"
import { storeDbUserInfo } from "@utils/toolbox/auxFns/storeDbUserInfo"

export type Routes = "home" | "selectEvent" | "products" | "qrhistory"

type AppRoutes = {
  [r in Routes]: undefined
}

export type AppNavigatiorRoutesProps = DrawerNavigationProp<AppRoutes>

const { Navigator, Screen } = createDrawerNavigator<AppRoutes>()

export function AppRoutes() {
  const connection = useNetInfo()
  const {
    user,
    currentEvent: event,
    headerColor,
    lastSync,
    token,
    mustSync,
    Common,
    User,
  } = useStore((state) => state)
  const [popupShow, setPopupShow] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncPopup, setSyncPopup] = useState({
    show: false,
    success: false,
  })

  const navigation = useNavigation<AppNavigatiorRoutesProps>()

  const syncInfo = async () => {
    setSyncing(true)
    setSyncPopup({ show: true, success: false })
    const operations = await Operation.getOperationsNoSync()
    const orders = await Order.getOrdersNoSync()
    const products = await Product.getProductsNoSync()
    const validations = await Validation.getValidationsNoSync()

    const data = {
      orders,
      products,
      validations,
      operations,
      token,
    }

    // get info
    const sync = await Api.syncUser(
      user?.org_id as string,
      user?.id as string,
      lastSync ?? 0,
      token
    )

    if (sync.ok) {
      User.storeSyncInfo(sync.data)
      await storeDbUserInfo(sync.data)
        .then(async () => {
          try {
            // pegar validações
            const onlineValidations = await Api.getOnlineValidations(
              event?.id as string,
              token
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
                } else if (!localMatch && val.user_id === user?.id) {
                  // para aquelas que não, registrar
                  await Validation.insertValidation(
                    val.uid,
                    user?.id,
                    true,
                    new Date(val.created_at).getTime(),
                    new Date(val.updated_at).getTime()
                  )
                }
              })
            }

            // uploadInfo
            const now = new Date().getTime()
            Api.uploadSync(data).then((upSync) => {
              if (upSync.ok) {
                const { validations } = upSync.data
                if (validations) {
                  validations.forEach(async (v: any) => {
                    return new Promise(async (resolve) => {
                      await Validation.updateValidation(v.uid, true)
                      resolve(true)
                    })
                  })
                }
                setSyncPopup({ show: true, success: upSync.ok })

                Common.setLastSync(now)
                setData("lastSync", String(now))
                Common.setSyncObligation(false)
                setData("mustSync", "false")
              }
            })
          } catch (error) {}
        })
        .catch(() => {
          setSyncPopup({ show: true, success: false })
        })
    } else {
      setSyncPopup({ show: true, success: false })
    }

    setSyncing(false)
  }

  const getDateStr = (date: number) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0"),
      month = String(d.getMonth() + 1).padStart(2, "0"),
      year = String(d.getFullYear())

    return `${day}/${month}/${year}`
  }

  const getOutEvent = () => {
    setPopupShow(false)
    navigation.reset({
      index: 0,
      routes: [{ name: "selectEvent" }],
    })
  }

  const renderIcon = (type: "home" | "history" | "sync" | "prods") => {
    let icon = null

    switch (type) {
      case "home":
        icon = <HomeIcon width={32} />
        break
      case "history":
        icon = <HistoryIcon width={32} />
        break
      case "sync":
        icon = <SyncIcon width={32} />
        break
      case "prods":
        icon = <ProdsIcon width={32} />
        break
    }

    return <View style={{ marginRight: -24 }}>{icon}</View>
  }

  const renderHeader = () => {
    return (
      <HStack
        flex={1}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        style={{ gap: 4 }}
      >
        <VStack>
          <Text fontFamily={"heading"} fontSize={"lg"} color={"gray.50"}>
            {event?.name}
          </Text>
          <Text fontFamily={"body"} fontSize={"md"} color={"gray.50"}>
            {`${event?.local} ${
              event?.date ? `- ${getDateStr(event?.date as number)}` : ""
            }`}
          </Text>
        </VStack>
        <Spacer />
        <Onlinetag mr={4} isOnline={connection.isConnected ?? false} />
      </HStack>
    )
  }

  const renderSyncPopupMsg = () => {
    let str = ""
    if (syncPopup.success) str = "Dados sincronizados com successo"
    else {
      str = `Não foi possível sincronizar`
      if (!connection.isConnected) str += " Você precisa estar ONLINE"
    }

    return str
  }

  return (
    <>
      <PopUp
        close={() => setPopupShow(false)}
        action={mustSync ? () => setPopupShow(false) : getOutEvent}
        description={
          mustSync
            ? "Você precisa sincronizar os seus dados antes"
            : "Tem certeza que deseja sair deste evento?"
        }
        title="Atenção"
        btnText={mustSync ? "Fechar" : "Sair do evento"}
        icon={mustSync ? "refresh" : "logout"}
        showing={popupShow}
      />
      <PopUp
        close={() => setSyncPopup({ show: false, success: false })}
        action={() => setSyncPopup({ show: false, success: false })}
        description={renderSyncPopupMsg()}
        title={syncPopup.success ? "Sincronizado" : "Erro!"}
        btnText="Fechar"
        showing={syncPopup.show}
        isSync={true}
        isSyncing={syncing}
      />
      <Navigator
        useLegacyImplementation={false}
        screenOptions={{
          headerShown: true,
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: {
            width: Dimensions.get("screen").width * 0.8,
          },
          headerRight: () => renderHeader(),
          headerTitle: "",
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerShadowVisible: false,
        }}
        initialRouteName={"selectEvent"}
        drawerContent={(props) => {
          return (
            <SafeAreaView
              style={{
                justifyContent: "space-between",
                paddingVertical: 32,
                paddingHorizontal: 12,
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  height: 120,
                  paddingTop: 24,
                  paddingHorizontal: 12,
                }}
              >
                <Text fontFamily={"heading"} fontSize={"24px"}>
                  {event?.name}
                </Text>
                <Text fontFamily={"body"} fontSize={"16px"} color={"gray.400"}>
                  {user?.name}
                </Text>
              </View>
              <View>
                <DrawerItemList {...props} />
                <View>
                  <DrawerItem
                    labelStyle={{ fontSize: 16 }}
                    label={"Sincronizar informações"}
                    icon={() => renderIcon("sync")}
                    onPress={syncing ? () => null : syncInfo}
                  />
                  {mustSync && <View style={styles.badge} />}
                </View>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginLeft: 26,
                }}
                onPress={() => setPopupShow(true)}
              >
                <SignOutIcon width={32} />
                <Text>Sair do evento</Text>
              </TouchableOpacity>
            </SafeAreaView>
          )
        }}
      >
        <Screen
          name="home"
          component={Home}
          options={{
            drawerLabel: "Início",
            drawerIcon: () => renderIcon("home"),
          }}
        />
        <Screen
          name="selectEvent"
          component={SelectEvent}
          options={{
            drawerItemStyle: { display: "none" },
            swipeEnabled: false,
            headerShown: false,
          }}
        />
        <Screen
          name="products"
          component={AvailableProducts}
          options={{
            drawerLabel: "Produtos disponíveis",
            drawerIcon: () => renderIcon("prods"),
          }}
        />
        <Screen
          name="qrhistory"
          component={QrHistory}
          options={{
            drawerLabel: "Histórico de leitura",
            drawerIcon: () => renderIcon("history"),
          }}
        />
      </Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#dc2626",
    left: 40,
    top: 20,
  },
})
