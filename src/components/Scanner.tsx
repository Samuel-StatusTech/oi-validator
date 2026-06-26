import {
  BarcodeScanningResult,
  useCameraPermissions,
  CameraView,
} from "expo-camera"
import { FlashMode } from "expo-camera"
import React, { useEffect } from "react"
import { Dimensions, Text, StyleSheet } from "react-native"

type Props = {
  flashMode: FlashMode
  scanned: boolean
  onCodeScanned: (data: string) => any
  facing?: "front" | "back"
}

export function Scanner({ flashMode, scanned, onCodeScanned, facing = "back" }: Props) {
  const [hasPermission, requestPermission] = useCameraPermissions()
  const { width, height } = Dimensions.get("window")

  useEffect(() => {
    ;(async () => {
      if (!hasPermission) await requestPermission()
    })()
  }, [])

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    onCodeScanned(data)
  }

  if (hasPermission === null) {
    return (
      <Text style={styles.text}>
        Vc precisa permitir a utilização da sua camera
      </Text>
    )
  }

  if (!hasPermission.granted) {
    return <Text style={styles.text}>Não temos acesso a sua camera</Text>
  }

  return (
    <>
      <CameraView
        enableTorch={flashMode === "on"}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
        facing={facing}
      />
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  camera: {
    width: Dimensions.get("window").width,
    flex: 1,
  },
})
