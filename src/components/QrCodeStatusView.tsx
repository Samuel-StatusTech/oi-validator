import ErrorSVG from "@assets/erro.svg"
import SuccessSVG from "@assets/sucesso.svg"
import React, { useEffect, useRef } from "react"
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native"
import { THEME } from "../theme"

type Props = {
  qrCode: string
  isSuccess: boolean
  productName: string
  isOpen: boolean
  message: string
  onClose: () => any
  isValidating: boolean
  isChecked: boolean
  isRetrying: boolean
}

export function QrCodeStatusView({
  qrCode,
  isSuccess,
  productName,
  isOpen,
  onClose,
  message,
  isChecked,
  isValidating,
  isRetrying
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

  if (!isOpen) return null

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: THEME.colors.gray[700],
        },
      ]}
    >
      {isRetrying ? (
        <Text style={styles.validatingText}>Aguarde...</Text>
      ) : isValidating ? (
        <Text style={styles.validatingText}>Validando...</Text>
      ) : (
        <>
          <View style={styles.content}>
            {isSuccess ? (
              <SuccessSVG width={92} height={92} />
            ) : (
              <ErrorSVG width={92} height={92} />
            )}
            <Text style={styles.title}>
              {isSuccess && isChecked ? "Sucesso" : "Erro!"}
            </Text>
            <Text style={styles.message}>
              {isSuccess
                ? `${qrCode}`
                : message ?? "Código não aceito nessa portaria."}
            </Text>
            {isSuccess && productName && (
              <Text style={styles.message}>{productName}</Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width }]} />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 100,
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.gray[700],
  },
  validatingText: {
    color: THEME.colors.gray[200],
    fontFamily: THEME.fonts.heading,
    fontSize: 32,
  },
  content: {
    backgroundColor: THEME.colors.gray[700],
    width: Dimensions.get("screen").width * 0.8,
    height: Dimensions.get("screen").width * 0.8,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 12,
  },
  title: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 32,
  },
  message: {
    color: THEME.colors.gray[50],
    fontSize: THEME.fontSizes.xl,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 64,
    backgroundColor: THEME.colors.gray[600],
    paddingHorizontal: 42,
    paddingVertical: 22,
    elevation: 12,
    borderRadius: 64,
  },
  closeButtonText: {
    color: THEME.colors.gray[200],
    fontSize: 24,
    fontFamily: THEME.fonts.heading,
  },
  progressBar: {
    width: Dimensions.get("screen").width * 0.8,
    height: 7,
    marginTop: 88,
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  progressFill: {
    backgroundColor: THEME.colors.gray[300],
    height: 7,
  },
})
