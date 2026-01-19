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
  View,
  Text,
} from "react-native"
import { THEME } from "../theme"
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
import Api from "src/api"
import Validation from "@services/sqlite/models/Validation"
import Product from "@services/sqlite/models/Product"
import Operation from "@services/sqlite/models/Operations"
import Order from "@services/sqlite/models/Order"
import { storeDbUserInfo } from "@utils/toolbox/auxFns/storeDbUserInfo"
import { UserInfo } from "@utils/@types/data/user"

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

    try {
      setSyncPopup({ show: true, success: false })

      const operations = await Operation.getOperationsNoSync()
      const orders = await Order.getOrdersNoSync()
      const products = await Product.getProductsNoSync()

      const data = {
        orders,
        products,
        operations,
        token,
      }

      // get info
      const sync = await Api.users.syncUser({
        orgId: user?.org_id as string,
        userId: user?.id as string,
        eventId: event?.id as string,
        lastSync: lastSync ?? 0,
      })

      if (sync.ok) {
        const validatorSync = await Api.users.getValidatorData({
          userId: user?.id as string,
        })

        if (validatorSync.ok) {
          const validatorData = validatorSync.data
          let product_types = []

          if (Boolean(validatorData.validator.has_bar))
            product_types.push("bar")
          if (Boolean(validatorData.validator.has_park))
            product_types.push("estacionamento")
          if (Boolean(validatorData.validator.has_ticket))
            product_types.push("ingresso")

          const userRoleInfo: UserInfo["roleInfo"] = {
            ...validatorData.validator,
            products: validatorData.products,
            product_types,
          }

          User.storeInfo({ ...(user as UserInfo), roleInfo: userRoleInfo })
        }

        User.storeSyncInfo(sync.data)
        await storeDbUserInfo(sync.data)

        const syncValidationsRes = await Api.users.uploadData(data)

        if (syncValidationsRes.ok) {
          const syncsToUpdate = syncValidationsRes.data?.validationSuccess.map(
            (v: any) => v.uid,
          )

          if (syncsToUpdate.length > 0) {
            await Validation.updateValidations(syncsToUpdate)
          }
        }

        setSyncPopup({ show: true, success: syncValidationsRes.ok })
      } else {
        setSyncPopup({ show: true, success: false })
      }
    } catch (error) {
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
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event?.name}
          </Text>
          <Text
            style={styles.headerSubtitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`${event?.local} ${
              event?.date ? `- ${getDateStr(event?.date as number)}` : ""
            }`}
          </Text>
        </View>
        <Onlinetag mr={4} isOnline={connection.isConnected ?? false} />
      </View>
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
          drawerLabelStyle: { fontSize: 16, color: THEME.colors.gray[50] },
          drawerStyle: {
            width: Dimensions.get("screen").width * 0.8,
          },
          headerRight: () => renderHeader(),
          headerTitle: "",
          headerTintColor: THEME.colors.gray[50],
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerShadowVisible: false,
        }}
        initialRouteName={event ? "home" : "selectEvent"}
        drawerContent={(props) => {
          return (
            <SafeAreaView
              style={{
                justifyContent: "space-between",
                paddingVertical: 32,
                paddingHorizontal: 12,
                flex: 1,
                width: "100%",
                backgroundColor: THEME.colors.gray[600],
              }}
            >
              <View
                style={{
                  height: 120,
                  paddingTop: 24,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={styles.drawerTitle}>{event?.name}</Text>
                <Text style={styles.drawerSubtitle}>{user?.name}</Text>
              </View>
              <View>
                <DrawerItemList {...props} />
                <View>
                  <DrawerItem
                    labelStyle={{ fontSize: 16, color: THEME.colors.gray[50] }}
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
                <Text style={{ color: THEME.colors.gray[50] }}>
                  Sair do evento
                </Text>
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
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  headerTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  headerTitle: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.gray[50],
  },
  headerSubtitle: {
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.md,
    color: THEME.colors.gray[200],
  },
  drawerTitle: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 24,
  },
  drawerSubtitle: {
    fontFamily: THEME.fonts.body,
    fontSize: 16,
    color: THEME.colors.gray[200],
  },
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
