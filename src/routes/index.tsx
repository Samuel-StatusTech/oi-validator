import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { AuthRoutes } from './auth.routes';
import { THEME } from '../theme';

export function Routes() {
  const theme = DefaultTheme;
  theme.colors.background = THEME.colors.gray[700];

  return (
    <View style={{ flex: 1, backgroundColor: THEME.colors.gray[700] }}>
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </View>
  );
}
