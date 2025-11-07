import React from "react"
import { TouchableOpacity } from "react-native"
import { Input, Text, VStack } from "native-base"
import { THEME } from "../theme"

type Props = {
  handleReturn: () => void
}

export function SaveEnergyArea({ handleReturn }: Props) {
  return (
    <TouchableOpacity
      style={{
        rowGap: 12,
        flex: 1,
        backgroundColor: THEME.colors.blue[300],
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
      onPress={handleReturn}
      activeOpacity={1}
    >
      <Text
        textAlign={"center"}
        color={"lightBlue.100"}
        fontSize={"28px"}
        fontFamily={"heading"}
      >
        Câmera desligada
      </Text>
      <Text
        textAlign={"center"}
        color={"lightBlue.100"}
        fontSize={"lg"}
        fontFamily={"body"}
      >
        Toque para ligar a câmera.
      </Text>
    </TouchableOpacity>
  )
}
