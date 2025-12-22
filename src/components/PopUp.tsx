import React, { useEffect, useState } from "react"
import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
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

  if (!showing) return null

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={isSyncing ? () => null : close}
        style={styles.overlay}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {icon && icon === "refresh" && <RefreshIcon />}
          {icon && icon === "logout" && <LogoutIcon />}
        </View>
        <Text style={styles.title}>
          {isSyncing ? "Sincronizando... " : title}
        </Text>
        <Text style={styles.description}>
          {isSyncing ? "Por favor aguarde" : description}
        </Text>
        {isSyncing ? (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={THEME.colors.blue[400]} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={action}
          >
            <Text style={styles.buttonText}>
              {btnText}
              {`${isSync ? (!hasConnection ? "Você está OFFLINE" : "") : ""}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, .7)",
  },
  container: {
    position: "absolute",
    zIndex: 12,
    width: Dimensions.get("screen").width * 0.8,
    marginHorizontal: Dimensions.get("screen").width * 0.1,
    marginVertical: Dimensions.get("screen").height / 2,
    transform: [{ translateY: -Dimensions.get("screen").height / 6 }],
    alignSelf: "center",
    backgroundColor: THEME.colors.gray[600],
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: THEME.fonts.heading,
    fontSize: 28,
    color: THEME.colors.blue[400],
    marginTop: 12,
  },
  description: {
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.lg,
    margin: 16,
    textAlign: "center",
    color: THEME.colors.blue[500],
  },
  spinnerContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: THEME.colors.blue[400],
    borderRadius: 50,
    alignItems: "center",
    paddingTop: 21,
    paddingBottom: 21,
    width: "100%",
  },
  buttonText: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.white,
  },
})
