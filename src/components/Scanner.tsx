import { scanFromURLAsync, BarcodeScanningResult, useCameraPermissions, CameraView } from 'expo-camera';
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
  const [hasPermission, requestPermission] = useCameraPermissions();
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      if (!hasPermission) await requestPermission();
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    onCodeScanned(data);
  };

  if (hasPermission === null) {
    return <Text>Vc precisa permitir a utilização da sua camera</Text>;
  }

  if (!hasPermission.granted) {
    return <Text>Não temos acesso a sua camera</Text>;
  }
  
  return (
    <>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          width: width,
          flex: 1
        }}
      />
    </>
  );
}
