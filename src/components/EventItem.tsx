import React from "react"
import { EventData } from "@utils/@types/data/event"
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"

type Props = {
  onSelect: () => void
  info: EventData
}

export function EventItem({ onSelect, info }: Props) {
  const getDateStr = (date: number) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0"),
      month = String(d.getMonth() + 1).padStart(2, "0"),
      year = String(d.getFullYear())

    return `${day}/${month}/${year}`
  }

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <View style={styles.content}>
        {info.logo_print ? (
          <Image
            source={{
              uri: info.logo_print,
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {info.name}
          </Text>
          <Text style={styles.subtitle}>
            {`${info.local} - ${getDateStr(info.date)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    width: "100%",
    backgroundColor: THEME.colors.white,
    height: 96,
    marginTop: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 96,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  placeholder: {
    width: 100,
    height: 96,
  },
  textContainer: {
    marginLeft: 16,
    marginRight: 16,
    flexShrink: 1
  },
  title: {
    color: THEME.colors.blue[600],
    fontSize: THEME.fontSizes.lg,
    fontFamily: THEME.fonts.heading,
  },
  subtitle: {
    color: THEME.colors.blue[200],
    fontSize: THEME.fontSizes.md,
  },
})
