import { Roboto_400Regular, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto"
import { Routes } from "@routes/index"
import { StatusBar } from "expo-status-bar"
import { Center, NativeBaseProvider, Spinner } from "native-base"
import { THEME } from "./src/theme"
import { useEffect, useState } from "react"
import { createTables } from "@services/sqlite/Database"

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  const [isTablesCreated, setTablesOk] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        await createTables()
        setTablesOk(true)
      } catch (error) {
        console.error("Falha ao criar tabelas")
      }
    })()
  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar backgroundColor="transparent" />
      {isTablesCreated ? (
        fontLoaded ? (
          <Routes />
        ) : (
          <Center flex={1}>
            <Spinner />
          </Center>
        )
      ) : (
        <Center flex={1}>
          <Spinner />
        </Center>
      )}
    </NativeBaseProvider>
  )
}
