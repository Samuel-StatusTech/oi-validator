import { Text, VStack, Image, View, Spinner } from "native-base"
import React, { useEffect, useState } from "react"
import { Dimensions, Touchable, TouchableOpacity } from "react-native"
import { THEME } from "../theme"

import RefreshIcon from "../assets/atualizar.svg"
import LogoutIcon from "../assets/sair.svg"

import Netinfo from "@react-native-community/netinfo"

type Props = {
  showing: boolean
  title: string
  description: string
  btnText: string
  action: () => void
  close: () => void
  icon?: "logout" | "refresh"
  isSync?: boolean
  isSyncing?: boolean
}

export function PopUp({
  showing,
  title,
  description,
  btnText,
  action,
  close,
  icon,
  isSync,
  isSyncing,
}: Props) {
  const [hasConnection, setHasConnection] = useState(false)

  useEffect(() => {
    Netinfo.refresh().then((state) => {
      setHasConnection(state.isConnected ?? false)
    })
  }, [])

  return showing ? (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={isSyncing ? () => null : close}
        style={{
          position: "absolute",
          zIndex: 10,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, .7)",
        }}
      />
      <VStack
        backgroundColor={"blue.10"}
        borderRadius={"16px"}
        paddingY={"32px"}
        paddingX={"16px"}
        style={{
          position: "absolute",
          zIndex: 12,
          width: Dimensions.get("screen").width * 0.8,
          marginHorizontal: Dimensions.get("screen").width * 0.1,
          marginVertical: Dimensions.get("screen").height / 2,
          transform: [{ translateY: -Dimensions.get("screen").height / 6 }],
          alignSelf: "center",
        }}
      >
        <View alignItems={"center"}>
          {icon && icon === "refresh" ? <RefreshIcon /> : null}
          {icon && icon === "logout" ? <LogoutIcon /> : null}
        </View>
        <Text
          textAlign={"center"}
          fontFamily={"heading"}
          fontSize={"28px"}
          color={"blue.600"}
          marginTop={"12px"}
        >
          {isSyncing ? "Sincronizando... " : title}
        </Text>
        <Text
          fontFamily={"body"}
          fontSize={"lg"}
          margin={"16px"}
          textAlign={"center"}
          color={"#283046"}
        >
          {isSyncing ? "Por favor aguarde" : description}
        </Text>
        {isSyncing ? (
          <View alignItems={"center"} marginTop={"12px"}>
            <Spinner w={"24px"} />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: THEME.colors.blue[50],
              borderRadius: 50,
              alignItems: "center",
              paddingTop: 21,
              paddingBottom: 21,
            }}
            activeOpacity={0.7}
            onPress={action}
          >
            <Text fontFamily={"heading"} fontSize={"lg"} color={"blue.400"}>
              {btnText}
              {`${isSync ? (!hasConnection ? "Você está OFFLINE" : "") : ""}`}
            </Text>
          </TouchableOpacity>
        )}
      </VStack>
    </>
  ) : (
    <></>
  )
}
