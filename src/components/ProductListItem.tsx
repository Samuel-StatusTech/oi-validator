import React, { memo } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { TProductListItem } from "@utils/@types/components/ProductListItem"
import { THEME } from "../theme"

type Props = {
  info: TProductListItem
}

function ProductListItem({ info }: Props) {
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

export const MemoizedProductListItem = memo(ProductListItem, (prev, current) => {
  const isEqual = 
    prev.info.msg === current.info.msg &&
    prev.info.name === current.info.name &&
    prev.info.qnt === current.info.qnt

  return isEqual
})

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
    color: THEME.colors.gray[50],
  },
  quantity: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.gray[200],
  },
  descriptionContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.gray[400],
    rowGap: 5,
  },
  description: {
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.sm,
    color: THEME.colors.gray[300],
  },
});
