import React, { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import Slider from "@react-native-community/slider"
import { THEME } from "../theme"
import useStore from "../store"

const SETTINGS_PASSWORD = "val@1234"

type Props = {
  visible: boolean
  onClose: () => void
}

export function SettingsModal({ visible, onClose }: Props) {
  const { feedbackDuration, Common } = useStore((state) => state)
  const [phase, setPhase] = useState<"password" | "settings">("password")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [localDuration, setLocalDuration] = useState(feedbackDuration)

  const handlePasswordSubmit = () => {
    if (password === SETTINGS_PASSWORD) {
      setLocalDuration(feedbackDuration)
      setPhase("settings")
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleClose = () => {
    setPhase("password")
    setPassword("")
    setPasswordError(false)
    onClose()
  }

  const handleSave = () => {
    Common.setFeedbackDuration(localDuration)
    handleClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.backdrop}
      >
        <View style={styles.container}>
          {phase === "password" ? (
            <>
              <Text style={styles.title}>Configurações</Text>
              <Text style={styles.label}>Digite a senha para continuar</Text>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  setPasswordError(false)
                }}
                placeholder="Senha"
                placeholderTextColor={THEME.colors.gray[400]}
                onSubmitEditing={handlePasswordSubmit}
                returnKeyType="done"
              />
              {passwordError && (
                <Text style={styles.errorText}>Senha incorreta</Text>
              )}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handlePasswordSubmit}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Configurações</Text>
              <Text style={styles.label}>Tempo de feedback</Text>
              <Text style={styles.durationValue}>
                {localDuration % 1 === 0
                  ? `${localDuration}s`
                  : `${localDuration.toFixed(1)}s`}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={0.5}
                value={localDuration}
                onValueChange={setLocalDuration}
                minimumTrackTintColor={THEME.colors.gray[200]}
                maximumTrackTintColor={THEME.colors.gray[500]}
                thumbTintColor={THEME.colors.gray[50]}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>1s</Text>
                <Text style={styles.sliderLabelText}>10s</Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleSave}
                >
                  <Text style={styles.confirmButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: THEME.colors.gray[600],
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 22,
  },
  label: {
    color: THEME.colors.gray[200],
    fontFamily: THEME.fonts.body,
    fontSize: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: THEME.colors.gray[700],
    color: THEME.colors.gray[50],
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: THEME.colors.gray[500],
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    alignSelf: "flex-start",
  },
  durationValue: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 36,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: -8,
  },
  sliderLabelText: {
    color: THEME.colors.gray[400],
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: THEME.colors.gray[500],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: THEME.colors.gray[200],
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: THEME.colors.gray[400],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 15,
  },
})
