import React from 'react';
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';
import { THEME } from '../theme'

type Props = {
  qrCode: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onConfirm: () => void;
};

export function QrCodeTypingArea({
  qrCode,
  onChange,
  onConfirm,
}: Props) {

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite manualmente o código:</Text>
      <TextInput
        value={qrCode}
        autoCapitalize='characters'
        onChangeText={onChange}
        style={styles.input}
        textAlign={'center'}
      />
      <TouchableOpacity
        onPress={onConfirm}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.gray[700],
    justifyContent: 'center',
    paddingHorizontal: 32,
    rowGap: 24,
  },
  label: {
    textAlign: 'center',
    color: THEME.colors.gray[50],
    fontSize: THEME.fontSizes.lg,
    fontFamily: THEME.fonts.heading,
  },
  input: {
    backgroundColor: THEME.colors.blue[600],
    borderRadius: 16,
    paddingVertical: 20,
    textAlign: 'center',
    fontFamily: THEME.fonts.heading,
    fontSize: 24,
    color: THEME.colors.gray[50],
  },
  button: {
    paddingVertical: 21,
    backgroundColor: THEME.colors.blue[300],
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: THEME.colors.blue[10],
    fontSize: 24,
    lineHeight: 24,
  },
});
