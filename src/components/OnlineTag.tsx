import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme';

type Props = {
  isOnline?: boolean;
  mr?: number;
};

export function Onlinetag({ isOnline = true, mr = 0 }: Props) {
  return (
    <View style={[styles.badge, { marginRight: mr }]}>
      <Text style={styles.text}>
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 130,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: THEME.colors.blue[50],
    fontSize: THEME.fontSizes.md,
    fontFamily: THEME.fonts.heading,
  },
});
