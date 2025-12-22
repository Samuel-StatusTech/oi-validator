import React, { forwardRef, MutableRefObject } from "react"
import { View, TextInput, Text, StyleSheet, TextInputProps } from "react-native"
import { THEME } from "../theme"

type Props = TextInputProps & {
  errorMessage?: string | null
  isInvalid?: boolean
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  onSubmitEditing?: () => void
  returnKeyType?: "done" | "go" | "next" | "search" | "send"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  InputRightElement?: React.ReactNode
}

export const Input = forwardRef((props: Props, ref: any) => {
  const { errorMessage = null, isInvalid, ...rest } = props

  const invalid = !!errorMessage || isInvalid

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        style={[styles.input, invalid && styles.inputError]}
        placeholderTextColor={THEME.colors.blue[200]}
        {...rest}
      />
      {invalid && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    width: "100%",
  },
  input: {
    backgroundColor: THEME.colors.blue[600],
    color: THEME.colors.blue[300],
    fontSize: THEME.fontSizes.xl,
    height: 64,
    marginTop: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 0,
  },
  inputError: {
    backgroundColor: THEME.colors.red[50],
    color: THEME.colors.red[500],
  },
  errorText: {
    color: THEME.colors.red[500],
    fontSize: THEME.fontSizes.sm,
    marginTop: 4,
  },
})
