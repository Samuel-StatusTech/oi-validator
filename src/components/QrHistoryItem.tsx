import React from "react"
import { Text, VStack } from "native-base"
import { TouchableOpacity } from "react-native"
import { TQrHistoryItem } from "@utils/@types/components/QrHistoryItem"

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
      <VStack
        paddingBottom={"8px"}
        borderBottomWidth={1}
        borderBottomColor={"rgba(198, 207, 220, 1)"}
        style={{ rowGap: 5 }}
      >
        <Text fontFamily={"heading"} fontSize={"lg"} color={"blue.600"}>
          {name}
        </Text>
        <Text fontFamily={"body"} fontSize={"sm"} color={"blue.500"}>
          {`${code} - ${getTime()}`}
        </Text>
      </VStack>
    </TouchableOpacity>
  )
}
