import FlashOffSVG from "@assets/flashlight.svg"
import FlashOnSVG from "@assets/flashlight10.svg"
import ToTypeOffSVG from "@assets/toType.svg"
import ToTypeOnSVG from "@assets/toType10.svg"
import React, { useState } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { THEME } from "../theme"
import { FlashMode } from "expo-camera"

type Propos = {
  flashMode: FlashMode
  mode: "camera" | "typing" | "saveEnergy"
  handleTyping: () => void
  updateFlash: () => void
}

export function BottomBar({
  flashMode,
  mode,
  handleTyping,
  updateFlash,
}: Propos) {
  const [isFlashlight, setFlashlight] = useState(false)

  function handleiFlashlight() {
    setFlashlight(!isFlashlight)
    updateFlash()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTyping}>
        <View
          style={[styles.buttonInner, mode === "typing" && styles.activeButton]}
        >
          {mode === "typing" ? <ToTypeOnSVG /> : <ToTypeOffSVG />}
          <Text style={[styles.text, mode === "typing" && styles.activeText]}>
            Digitar
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleiFlashlight}>
        <View
          style={[
            styles.buttonInner,
            flashMode === "on" && styles.activeButton,
          ]}
        >
          {flashMode === "on" ? <FlashOnSVG /> : <FlashOffSVG />}
          <Text style={[styles.text, flashMode === "on" && styles.activeText]}>
            Lanterna
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: THEME.colors.white,
  },
  button: {
    flex: 1,
  },
  buttonInner: {
    marginLeft: 16,
    marginRight: 8,
    height: 64,
    backgroundColor: THEME.colors.blue[50],
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: THEME.colors.blue[400],
  },
  text: {
    color: THEME.colors.blue[500],
    fontFamily: THEME.fonts.body,
    fontSize: THEME.fontSizes.lg,
    marginLeft: 8,
  },
  activeText: {
    color: THEME.colors.blue[10],
  },
})
