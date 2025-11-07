import React from "react"
import { Text, VStack } from "native-base"

function QrHistoryEmpty() {
  return (
    <VStack flex={1} justifyContent={"center"}>
      <Text textAlign={"center"} fontSize={"16px"}>
        Nenhum código escaneado até o momento
      </Text>
    </VStack>
  )
}

export default QrHistoryEmpty
