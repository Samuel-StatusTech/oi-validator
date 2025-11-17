import { Roboto_400Regular, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto"
import { Routes } from "@routes/index"
import { StatusBar } from "expo-status-bar"
import { View, ActivityIndicator, StyleSheet } from "react-native"
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
    <>
      <StatusBar backgroundColor="transparent" />
      {isTablesCreated ? (
        fontLoaded ? (
          <Routes />
        ) : (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={THEME.colors.blue[500]} />
          </View>
        )
      ) : (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={THEME.colors.blue[500]} />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
