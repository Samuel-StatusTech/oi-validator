import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { THEME } from '../theme';

type Props = {
  title: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
};

export function Button({
  title,
  isLoading = false,
  isDisabled = false,
  onPress,
  ...rest
}: Props) {
  const disable = isDisabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disable && styles.disabled,
      ]}
      disabled={disable}
      onPress={onPress}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={THEME.colors.blue[200]} />
      ) : (
        <Text
          style={[
            styles.text,
            isDisabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.blue[400],
    width: '100%',
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: THEME.colors.blue[50],
    opacity: 1,
  },
  text: {
    color: THEME.colors.white,
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSizes.sm,
  },
  disabledText: {
    color: THEME.colors.blue[200],
  },
});
