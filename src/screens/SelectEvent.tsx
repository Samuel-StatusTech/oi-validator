import { FlatList, View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"
import LogoWhite from "@assets/logoWhite.svg"
import { Button } from "@components/Button"
import { EventItem } from "@components/EventItem"
import { Onlinetag } from "@components/OnlineTag"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps } from "@routes/auth.routes"
import { EventData } from "@utils/@types/data/event"
import { useCallback, useEffect, useRef, useState } from "react"
import useStore from "../store"
import { useNetInfo } from "@react-native-community/netinfo"
import { PopUp } from "@components/PopUp"
import { AppNavigatiorRoutesProps } from "@routes/app.routes"
import { dropTables } from "@services/sqlite/Database"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Api from "src/api"
import { storeDbUserInfo } from "@utils/toolbox/auxFns/storeDbUserInfo"

export function SelectEvent() {
  const insets = useSafeAreaInsets()

  const connection = useNetInfo()

  const Common = useStore((s) => s.Common)
  const Token = useStore((s) => s.Token)
  const User = useStore((s) => s.User)
  const user = useStore((s) => s.user)
  const event = useStore((s) => s.currentEvent)
  const token = useStore((s) => s.token)
  const lastSync = useStore((s) => s.lastSync)

  const [reloading, setReloading] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const [showingPopUp, setShowingPopUp] = useState(false)

  const navigation = useNavigation<AppNavigatiorRoutesProps>()
  const authNavigation = useNavigation<AuthNavigatiorRoutesProps>()

  const flatListRef = useRef(null)

  const sortEvents = (list: EventData[]) =>
    list.sort((a, b) => (a.date > b.date ? -1 : 1))

  function handleDesconect() {
    User.cleanInfo()
    Token.deleteToken()
    dropTables()
    setShowingPopUp(false)

    authNavigation.reset({
      index: 0,
      routes: [{ name: "signIn" }],
    })
  }

  function handleSelect(event: EventData) {
    Common.registerEvent(event)
    navigation.navigate("home")
  }

  const reloadData = useCallback(async () => {
    try {
      setReloading(true)

      const req = await Api.users.syncUser({
        orgId: user?.org_id as string,
        userId: user?.id as string,
        eventId: event?.id as string,
        lastSync: lastSync ?? 0,
      })

      if (req.ok) {
        User.storeSyncInfo(req.data)
        await storeDbUserInfo(req.data)

        const newList = req.data.eventsData.filter((event) =>
          Boolean(event.status)
        )

        setEvents(sortEvents(newList))
      }
    } catch (error) {}

    setReloading(false)
  }, [])

  useEffect(() => {
    Common.clearEvent()
    if (user?.kInfo)
      setEvents(
        sortEvents(
          user?.kInfo?.eventsData.filter((event) => Boolean(event.status))
        )
      )
  }, [])

  return (
    <>
      <PopUp
        showing={showingPopUp}
        title="Atenção"
        description="Tem certeza que deseja desconectar do aplicativo?"
        btnText="Desconectar"
        close={() => setShowingPopUp(false)}
        action={handleDesconect}
      />
      <View
        style={{
          ...styles.container,
          paddingTop: styles.container.paddingTop + insets.top,
          paddingRight: styles.container.paddingHorizontal + insets.right,
          paddingBottom: styles.container.paddingTop + insets.bottom,
          paddingLeft: styles.container.paddingHorizontal + insets.left,
        }}
      >
        <View style={styles.header}>
          <LogoWhite />
          <Onlinetag isOnline={connection.isConnected ?? false} />
        </View>
        <View style={styles.center}>
          <Text style={styles.greeting}>Olá, {user?.name}</Text>
          <Text style={styles.description}>
            Selecione o evento que você irá atender hoje
            {user?.kInfo?.orgName ? `pela ${user?.kInfo?.orgName}` : ""}.
          </Text>
        </View>

        <View style={styles.spacer} />

        <FlatList
          refreshing={reloading}
          onRefresh={reloadData}
          ref={flatListRef}
          data={events}
          renderItem={({ item, index }) => (
            <EventItem
              key={index}
              onSelect={() => handleSelect(item)}
              info={item}
            />
          )}
          overScrollMode="never"
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />

        <View style={styles.spacer} />

        <Button title="Desconectar" onPress={() => setShowingPopUp(true)} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.blue[300],
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    marginTop: 16,
    alignItems: "center",
  },
  greeting: {
    color: "white",
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.xl,
  },
  description: {
    color: "white",
    fontSize: THEME.fontSizes.lg,
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
  flatList: {
    paddingRight: 0,
  },
  flatListContent: {
    rowGap: 16,
  },
})
