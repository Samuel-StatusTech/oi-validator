import ErrorSVG from "@assets/erro.svg"
import SuccessSVG from "@assets/sucesso.svg"
import { Actionsheet, Button, Text, VStack, View } from "native-base"
import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, TouchableOpacity } from "react-native"

type Props = {
  qrCode: string
  isSuccess: boolean
  isOpen: boolean
  message: string
  onClose: () => any
  isValidating: boolean
  isChecked: boolean
}

export function QrCodeStatusView({
  qrCode,
  isSuccess,
  isOpen,
  onClose,
  message,
  isChecked,
  isValidating,
}: Props) {
  const width = useRef(new Animated.Value(0)).current

  const animate = () => {
    Animated.timing(width, {
      toValue: Dimensions.get("screen").width * 0.8,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      handleClose()
    })
  }

  useEffect(() => {
    if (isOpen && isChecked) {
      setTimeout(() => {
        animate()
      }, 300)
    }
  }, [isOpen, isChecked])

  const handleClose = () => {
    width.stopAnimation()
    onClose()
    Animated.timing(width, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start()
  }

  return (
    <VStack
      display={isOpen ? "flex" : "none"}
      position={"absolute"}
      zIndex={100}
      w="100%"
      h={"full"}
      px={4}
      justifyContent={"center"}
      alignItems={"center"}
      bgColor={!isChecked ? "#FFF" : isSuccess ? "#22c55e" : "red.600"}
    >
      {isValidating ? (
        <Text color={"blue.600"} fontFamily={"heading"} fontSize={"32px"}>
          Validando...
        </Text>
      ) : (
        <>
          <VStack
            bgColor={"#FFF"}
            w={Dimensions.get("screen").width * 0.8}
            h={Dimensions.get("screen").width * 0.8}
            borderRadius={16}
            padding={"16px"}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
              rowGap: 12,
            }}
          >
            {isSuccess ? (
              <SuccessSVG width={92} height={92} />
            ) : (
              <ErrorSVG width={92} height={92} />
            )}
            <Text color={"blue.600"} fontFamily={"heading"} fontSize={"32px"}>
              {isSuccess && isChecked ? "Sucesso" : "Erro!"}
            </Text>
            <Text color={"blue.600"} fontSize={"xl"} textAlign={"center"}>
              {isSuccess
                ? `${qrCode}`
                : message ?? "Código não aceito nessa portaria."}
            </Text>
          </VStack>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClose}
            style={{
              marginTop: 64,
              backgroundColor: "rgb(255, 255, 255)",
              paddingHorizontal: 42,
              paddingVertical: 22,
              elevation: 12,
              borderRadius: 64,
            }}
          >
            <Text color={"#232323"} fontSize={"24px"} fontFamily={"heading"}>
              Fechar
            </Text>
          </TouchableOpacity>
          <View
            w={Dimensions.get("screen").width * 0.8}
            h={"7px"}
            marginTop={"88px"}
            borderRadius={7}
            overflow={"hidden"}
          >
            <Animated.View
              style={{
                width: width,
                backgroundColor: "#375367",
                height: 7,
              }}
            />
          </View>
        </>
      )}
    </VStack>
  )
}
