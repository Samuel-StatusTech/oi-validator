import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Input, Text, VStack } from 'native-base';
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
    <VStack
      flex={1}
      backgroundColor={'blue.300'}
      justifyContent={'center'}
      paddingX={'32px'}
      style={{ rowGap: 24 }}
    >
      <Text
        textAlign={'center'}
        color={'lightBlue.100'}
        fontSize={'lg'}
        fontFamily={'heading'}
      >Digite manualmente o código:</Text>
      <Input
        value={qrCode}
        autoCapitalize='characters'
        onChangeText={onChange}
        backgroundColor={'lightBlue.50'}
        borderRadius={16}
        paddingY={'20px'}
        textAlign={'center'}
        fontFamily={'heading'}
        fontSize={'24px'}
        color={'blue.600'}
        />
      <TouchableOpacity
        onPress={onConfirm}
        style={{
          paddingVertical: 21,
          backgroundColor: THEME.colors.blue[300],
          alignItems: 'center',
          borderRadius: 50,
        }}
      >
        <Text
          textAlign={'center'}
          color={'lightBlue.100'}
          style={{
            fontSize: 24,
            lineHeight: 24
          }}
        >Confirmar</Text>
      </TouchableOpacity>
    </VStack>
  );
}
