import React, { useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../theme';

type Props = {
  title: string;
  message: string;
  onClose: () => void;
};

export function Alert({ title, message, onClose }: Props) {
  const cancelRef = useRef(null);

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            ref={cancelRef}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: THEME.colors.white,
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: THEME.fontSizes.md,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.blue[600],
  },
  body: {
    marginBottom: 16,
  },
  message: {
    fontSize: THEME.fontSizes.md,
    color: THEME.colors.gray[700],
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: THEME.colors.blue[400],
    fontSize: THEME.fontSizes.md,
  },
});
