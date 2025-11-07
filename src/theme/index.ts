import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    blue: {
      10: '#F7F8FD',
      50: '#E9F3F9',
      200: '#91ACBE',
      300: '#0097FE',
      400: '#0084DE',
      500: '#46799B',
      600: '#375367',
      900: '#02111B',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
      50: '#F2F2F2',
    },

    white: '#FFFFFF',
    red: {
      50: '#F6D5D5',
      500: '#E85353',
    },
    green: {
      500: '#5ABC6A',
    },
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  sizes: {
    14: 56,
    33: 148,
  },
});
