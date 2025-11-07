import FlashOffSVG from "@assets/flashlight.svg"
import FlashOnSVG from "@assets/flashlight10.svg"
import ToTypeOffSVG from "@assets/toType.svg"
import ToTypeOnSVG from "@assets/toType10.svg"
import { HStack, Text } from "native-base"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

type Propos = {
  mode: "camera" | "typing" | "saveEnergy"
  handleTyping: () => void
  updateFlash: () => void
}

export function BottomBar({ mode, handleTyping, updateFlash }: Propos) {
  const [isFlashlight, setFlashlight] = useState(false)

  function handleiFlashlight() {
    setFlashlight(!isFlashlight)
    updateFlash()
  }

  return (
    <HStack
      h={"24"}
      alignItems={"center"}
      zIndex={10}
      backgroundColor={"white"}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={handleTyping}>
        <HStack
          ml={4}
          mr={2}
          h={"16"}
          bg={mode === "typing" ? "blue.400" : "blue.50"}
          rounded={"full"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {mode === "typing" ? <ToTypeOnSVG /> : <ToTypeOffSVG />}
          <Text
            color={mode === "typing" ? "blue.10" : "blue.500"}
            fontFamily={"body"}
            fontSize={"lg"}
          >
            Digitar
          </Text>
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity style={{ flex: 1 }} onPress={handleiFlashlight}>
        <HStack
          ml={2}
          mr={4}
          h={"16"}
          bg={isFlashlight ? "blue.400" : "blue.50"}
          rounded={"full"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {isFlashlight ? <FlashOnSVG /> : <FlashOffSVG />}

          <Text
            pl={4}
            color={isFlashlight ? "blue.10" : "blue.500"}
            fontFamily={"body"}
            fontSize={"lg"}
          >
            Lanterna
          </Text>
        </HStack>
      </TouchableOpacity>
    </HStack>
  )
}
