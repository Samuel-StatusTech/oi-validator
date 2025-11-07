import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Camera, FlashMode } from 'expo-camera'
import { Text } from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

type Props = {
  flashMode: FlashMode;
  scanned: boolean;
  onCodeScanned: (data: string) => any;
};

export function Scanner({ flashMode, scanned, onCodeScanned }: Props) {
  const [hasPermission, setHasPermission] = useState<null|boolean>(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    onCodeScanned(data);
  };

  if (hasPermission === null) {
    return <Text>Vc precisa permitir a utilização da sua camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Não temos acesso a sua camera</Text>;
  }
  
  return (
    <>
      <Camera
        flashMode={flashMode}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          width: width,
          flex: 1
        }}
      />
    </>
  );
}
