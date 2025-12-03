import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { TQrHistoryItem } from "@utils/@types/components/QrHistoryItem"
import { THEME } from "../theme"

type Props = {
  info: TQrHistoryItem
}

export function QrHistoryItem({ info }: Props) {
  const { name, code, date } = info

  const checkValidationDay = (date: number | Date) => {
    const today = new Date()
    const d = new Date(date)

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  }

  const padValue = (n: number) => String(n).padStart(2, "0")

  function getTime() {
    const wasValidatedToday = checkValidationDay(date)
    const d = new Date(date)
    const hour = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")

    return (
      `${hour}:${minutes}` +
      `${
        !wasValidatedToday
          ? `  ${padValue(d.getDate())}/` +
            `${padValue(d.getMonth() + 1)}/` +
            `${d.getFullYear()}`
          : ""
      }`
    )
  }

  return (
    <TouchableOpacity activeOpacity={0.55}>
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.details}>{code}</Text>

          <Text style={styles.details}>{getTime()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(198, 207, 220, 1)",
    rowGap: 5,
  },
  name: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.blue[600],
  },
  details: {
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.sm,
    color: THEME.colors.blue[500],
  },
})
