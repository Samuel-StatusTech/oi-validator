import { FlatList, View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"
import LogoWhite from "@assets/logoWhite.svg"
import { Button } from "@components/Button"
import { EventItem } from "@components/EventItem"
import { Onlinetag } from "@components/OnlineTag"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps } from "@routes/auth.routes"
import { EventData } from "@utils/@types/data/event"
import { useEffect, useRef, useState } from "react"
import useStore from "../store"
import { useNetInfo } from "@react-native-community/netinfo"
import { PopUp } from "@components/PopUp"
import { setData } from "../store/reducers/persistorReducer"
import { AppNavigatiorRoutesProps } from "@routes/app.routes"
import { dropTables } from "@services/sqlite/Database"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function SelectEvent() {
  const insets = useSafeAreaInsets();

  const connection = useNetInfo()
  const { user, User, Common, Token } = useStore((state) => state)
  const [events, setEvents] = useState<EventData[]>([])
  const [showingPopUp, setShowingPopUp] = useState(false)

  const navigation = useNavigation<AppNavigatiorRoutesProps>()
  const authNavigation = useNavigation<AuthNavigatiorRoutesProps>()

  const flatListRef = useRef(null)

  function handleDesconect() {
    User.cleanInfo()
    Token.deleteToken()
    Common.clearEvent()
    dropTables()
    setShowingPopUp(false)

    authNavigation.reset({
      index: 0,
      routes: [{ name: "signIn" }],
    })
  }

  function handleSelect(event: EventData) {
    Common.registerEvent(event)
    setData("currentEvent", JSON.stringify(event))
    navigation.navigate("home")
  }

  useEffect(() => {
    if (user?.kInfo) setEvents(user?.kInfo?.eventsData.filter(event => Boolean(event.status)))
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
      <View style={{
        ...styles.container,
        paddingTop: styles.container.paddingTop + insets.top,
        paddingRight: styles.container.paddingHorizontal + insets.right,
        paddingBottom: styles.container.paddingTop + insets.bottom,
        paddingLeft: styles.container.paddingHorizontal + insets.left,
      }}>
        <View style={styles.header}>
          <LogoWhite />
          <Onlinetag isOnline={connection.isConnected ?? false} />
        </View>
        <View style={styles.center}>
          <Text style={styles.greeting}>
            Olá, {user?.name}
          </Text>
          <Text style={styles.description}>
            Selecione o evento que você irá atender hoje
            {user?.kInfo?.orgName ? `pela ${user?.kInfo?.orgName}` : ""}.
          </Text>
        </View>

        <View style={styles.spacer} />

        <FlatList
          ref={flatListRef}
          data={events}
          renderItem={({ item, index }) => (
            <EventItem key={index} onSelect={() => handleSelect(item)} info={item} />
          )}
          overScrollMode="never"
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />

        <View style={styles.spacer} />

        <Button
          title="Desconectar"
          onPress={() => setShowingPopUp(true)}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    marginTop: 16,
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.xl,
  },
  description: {
    color: 'white',
    fontSize: THEME.fontSizes.lg,
    textAlign: 'center',
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
