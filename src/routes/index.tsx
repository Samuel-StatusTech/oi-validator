import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Box, useTheme } from 'native-base';
import { AuthRoutes } from './auth.routes';

export function Routes() {
  const { colors } = useTheme();
  // const { user, isLoadingUserData } = useAuth();
  // console.log('USER ON', user);
  const theme = DefaultTheme;
  theme.colors.background = colors.white;

  return (
    <Box flex={1} bg={'white'}>
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
