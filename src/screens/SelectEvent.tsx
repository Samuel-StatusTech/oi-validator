import LogoWhite from "@assets/logoWhite.svg"
import { Button } from "@components/Button"
import { EventItem } from "@components/EventItem"
import { Onlinetag } from "@components/OnlineTag"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps } from "@routes/auth.routes"
import { EventData } from "@utils/@types/data/event"
import { Center, HStack, Heading, Spacer, Text, VStack } from "native-base"
import { useEffect, useState } from "react"
import useStore from "../store"
import { useNetInfo } from "@react-native-community/netinfo"
import { PopUp } from "@components/PopUp"
import { setData } from "../store/reducers/persistorReducer"
import { AppNavigatiorRoutesProps } from "@routes/app.routes"
import { dropTables } from "@services/sqlite/Database"

export function SelectEvent() {
  const connection = useNetInfo()
  const { user, User, Common, Token } = useStore((state) => state)
  const [events, setEvents] = useState<EventData[]>([])
  const [showingPopUp, setShowingPopUp] = useState(false)

  const navigation = useNavigation<AppNavigatiorRoutesProps>()
  const authNavigation = useNavigation<AuthNavigatiorRoutesProps>()

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
    if (user?.kInfo) setEvents(user?.kInfo?.eventsData)
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
      <VStack h={"full"} bg={"blue.300"} safeAreaTop={16} safeAreaX={8}>
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <LogoWhite />
          <Onlinetag isOnline={connection.isConnected ?? false} />
        </HStack>
        <Center mt={16}>
          <Heading color={"white"} fontFamily={"heading"}>
            Olá, {user?.name}
          </Heading>
          <Text color={"white"} fontSize={"lg"} textAlign={"center"}>
            Selecione o evento que você irá atender hoje
            {user?.kInfo?.orgName ? `pela ${user?.kInfo?.orgName}` : ""}.
          </Text>

          {events &&
            events.map((e, k) => (
              <EventItem key={k} onSelect={() => handleSelect(e)} info={e} />
            ))}
        </Center>
        <Spacer />

        <Button
          title="Desconectar"
          mt={8}
          onPress={() => setShowingPopUp(true)}
          mb={16}
        />
      </VStack>
    </>
  )
}
