import FlashOffSVG from "@assets/flashlight.svg"
import FlashOnSVG from "@assets/flashlight10.svg"
import ToTypeOffSVG from "@assets/toType.svg"
import QrCodeSVG from "@assets/qrcode.svg"
import SwitchCameraIcon from "@assets/atualizar.svg"
import React, { useState } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"
import { FlashMode } from "expo-camera"

type Propos = {
  flashMode: FlashMode
  mode: "camera" | "typing" | "saveEnergy"
  handleTyping: () => void
  updateFlash: () => void
  onSwitchCamera: () => void
}

export function BottomBar({
  flashMode,
  mode,
  handleTyping,
  updateFlash,
  onSwitchCamera,
}: Propos) {
  const [isFlashlight, setFlashlight] = useState(false)

  function handleiFlashlight() {
    setFlashlight(!isFlashlight)
    updateFlash()
  }

  const isTyping = mode === "typing"

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fullButton} onPress={handleTyping}>
        <View
          style={[styles.buttonInner, isTyping && styles.activeButton]}
        >
          {isTyping ? <QrCodeSVG width={28} height={28} /> : <ToTypeOffSVG />}
          <Text style={[styles.text, isTyping && styles.activeText]}>
            {isTyping ? "QR Code" : "Digitar"}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.halfButton}
          onPress={handleiFlashlight}
          disabled={isTyping}
        >
          <View
            style={[
              styles.buttonInner,
              flashMode === "on" && !isTyping && styles.activeButton,
              isTyping && styles.disabledButton,
            ]}
          >
            {flashMode === "on" && !isTyping ? <FlashOnSVG /> : <FlashOffSVG />}
            <Text style={[styles.text, flashMode === "on" && !isTyping && styles.activeText, isTyping && styles.disabledText]}>
              Lanterna
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.halfButton} onPress={onSwitchCamera} disabled={isTyping}>
          <View style={[styles.buttonInner, isTyping && styles.disabledButton]}>
            <SwitchCameraIcon width={28} />
            <Text style={[styles.text, isTyping && styles.disabledText]}>{"Trocar\ncâmera"}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    zIndex: 10,
    backgroundColor: THEME.colors.gray[700],
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
  },
  fullButton: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  halfButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  buttonInner: {
    height: 56,
    backgroundColor: THEME.colors.gray[600],
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: THEME.colors.blue[400],
  },
  disabledButton: {
    opacity: 0.35,
  },
  text: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.lg,
    marginLeft: 8,
  },
  activeText: {
    color: THEME.colors.gray[100],
  },
  disabledText: {
    color: THEME.colors.gray[400],
  },
})
