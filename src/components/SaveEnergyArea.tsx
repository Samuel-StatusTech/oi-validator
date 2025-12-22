import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"

type Props = {
  handleReturn: () => void
}

export function SaveEnergyArea({ handleReturn }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleReturn}
      activeOpacity={1}
    >
      <Text style={styles.title}>
        Câmera desligada
      </Text>
      <Text style={styles.subtitle}>
        Toque para ligar a câmera.
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
    flex: 1,
    backgroundColor: THEME.colors.gray[700],
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    textAlign: "center",
    color: THEME.colors.blue[400],
    fontSize: 28,
    fontFamily: THEME.fonts.heading,
  },
  subtitle: {
    textAlign: "center",
    color: THEME.colors.blue[500],
    fontSize: THEME.fontSizes.lg,
    fontFamily: THEME.fonts.body,
  },
});
