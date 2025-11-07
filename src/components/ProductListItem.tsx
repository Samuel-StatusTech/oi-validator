import React from "react"
import { Text, VStack } from "native-base"
import { TouchableOpacity } from "react-native"
import { TProductListItem } from "@utils/@types/components/ProductListItem"

type Props = {
  info: TProductListItem
}

export function ProductListItem({ info }: Props) {
  const { name, qnt, msg } = info

  return (
    <TouchableOpacity activeOpacity={0.55}>
      <VStack paddingBottom={"8px"} style={{ rowGap: 5 }}>
        <Text fontFamily={"heading"} fontSize={"lg"} color={"blue.600"}>
          {name}
        </Text>
        <Text fontFamily={"heading"} fontSize={"lg"} color={"blue.300"}>
          {`#${qnt} Escaneado${qnt > 1 ? "s" : ""}`}
        </Text>
      </VStack>
      <VStack
        paddingBottom={"8px"}
        borderBottomWidth={1}
        borderBottomColor={"rgba(198, 207, 220, 1)"}
        style={{ rowGap: 5 }}
      >
        <Text fontFamily={"body"} fontSize={"sm"} color={"blue.500"}>
          {msg.trim().length > 0 ? msg : "Produto sem descrição"}
        </Text>
      </VStack>
    </TouchableOpacity>
  )
}
