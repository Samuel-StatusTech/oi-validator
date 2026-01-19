import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"

function QrHistoryEmpty({ loading }: { loading: boolean }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {loading
          ? "Carregando lista..."
          : "Nenhum código escaneado até o momento"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: THEME.colors.gray[50],
  },
})

export default QrHistoryEmpty
