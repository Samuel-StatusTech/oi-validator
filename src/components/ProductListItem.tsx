import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { TProductListItem } from "@utils/@types/components/ProductListItem"
import { THEME } from "../theme"

type Props = {
  info: TProductListItem
}

export function ProductListItem({ info }: Props) {
  const { name, qnt, msg } = info

  return (
    <TouchableOpacity activeOpacity={0.55}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {name}
          </Text>
          <Text style={styles.quantity}>
            {`#${qnt} Escaneado${qnt > 1 ? "s" : ""}`}
          </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {msg.trim().length > 0 ? msg : "Produto sem descrição"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  textContainer: {
    paddingBottom: 8,
    rowGap: 5,
  },
  name: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.blue[600],
  },
  quantity: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.blue[300],
  },
  descriptionContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(198, 207, 220, 1)",
    rowGap: 5,
  },
  description: {
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.sm,
    color: THEME.colors.blue[500],
  },
});
