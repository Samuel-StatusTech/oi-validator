import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { CustomSlider } from "@components/CustomSlider"
import { THEME } from "../theme"
import useStore from "../store"

const SETTINGS_PASSWORD = "val@1234"

export function Settings() {
  const { feedbackDuration, screenLockTimeout, Common } = useStore((state) => state)

  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [localFeedback, setLocalFeedback] = useState(feedbackDuration)
  const [localLock, setLocalLock] = useState(screenLockTimeout)
  const [saved, setSaved] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsUnlocked(false)
      setPassword("")
      setPasswordError(false)
      setSaved(false)
    }, [])
  )

  const handleUnlock = () => {
    if (password === SETTINGS_PASSWORD) {
      setLocalFeedback(feedbackDuration)
      setLocalLock(screenLockTimeout)
      setIsUnlocked(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleSave = () => {
    Common.setFeedbackDuration(localFeedback)
    Common.setScreenLockTimeout(localLock)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const formatSeconds = (s: number) => {
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    const rem = s % 60
    return rem === 0 ? `${m}m` : `${m}m ${rem}s`
  }

  const formatDuration = (s: number) =>
    s % 1 === 0 ? `${s}s` : `${s.toFixed(1)}s`

  return (
    <SafeAreaView style={styles.container}>
      {!isUnlocked ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.passwordContainer}
        >
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Digite a senha para continuar</Text>
          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            secureTextEntry
            value={password}
            onChangeText={(t) => {
              setPassword(t)
              setPasswordError(false)
            }}
            placeholder="Senha"
            placeholderTextColor={THEME.colors.gray[400]}
            onSubmitEditing={handleUnlock}
            returnKeyType="done"
            autoFocus
          />
          {passwordError && (
            <Text style={styles.errorText}>Senha incorreta</Text>
          )}
          <TouchableOpacity style={styles.confirmButton} onPress={handleUnlock}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.settingsContainer}>
          <Text style={styles.title}>Configurações</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tempo de feedback</Text>
            <Text style={styles.valueDisplay}>{formatDuration(localFeedback)}</Text>
            <CustomSlider
              min={1}
              max={10}
              step={0.5}
              value={localFeedback}
              onChange={setLocalFeedback}
            />
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeText}>1s</Text>
              <Text style={styles.rangeText}>10s</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tempo de bloqueio de tela</Text>
            <Text style={styles.valueDisplay}>{formatSeconds(localLock)}</Text>
            <CustomSlider
              min={15}
              max={120}
              step={5}
              value={localLock}
              onChange={setLocalLock}
            />
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeText}>15s</Text>
              <Text style={styles.rangeText}>2m</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saved && styles.saveButtonSuccess]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {saved ? "Salvo!" : "Salvar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.gray[700],
  },
  passwordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  settingsContainer: {
    padding: 24,
    gap: 32,
  },
  title: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    color: THEME.colors.gray[200],
    fontFamily: THEME.fonts.body,
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: THEME.colors.gray[600],
    color: THEME.colors.gray[50],
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  confirmButton: {
    width: "100%",
    backgroundColor: THEME.colors.gray[500],
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonText: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 16,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: THEME.colors.gray[200],
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  valueDisplay: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 42,
    textAlign: "center",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    color: THEME.colors.gray[400],
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: THEME.colors.gray[500],
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonSuccess: {
    backgroundColor: "#22c55e",
  },
  saveButtonText: {
    color: THEME.colors.gray[50],
    fontFamily: THEME.fonts.heading,
    fontSize: 18,
  },
})
