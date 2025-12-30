import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"

type Props = {
  isOnline?: boolean
  mr?: number
}

export function Onlinetag({ isOnline = true, mr = 0 }: Props) {
  return (
    <View
      style={[
        styles.badge,
        {
          marginRight: mr,
          backgroundColor: isOnline
            ? THEME.colors.green[500]
            : THEME.colors.gray[500],
        },
      ]}
    >
      <Text style={styles.text}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    width: 130,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: THEME.colors.white,
    fontSize: THEME.fontSizes.md,
    fontFamily: THEME.fonts.heading,
  },
})
