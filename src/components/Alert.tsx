import { AlertDialog, Button as ButtonNative, Text } from 'native-base';
import { useRef } from 'react';

type Props = {
  title: string;
  message: string;
  onClose: () => void;
};

export function Alert({ title, message, onClose }: Props) {
  // const [isOpen, setIsOpen] = useState(true);

  // const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <Text fontSize={'md'} fontFamily={'heading'}>
            {title}
          </Text>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <Text fontSize={'md'}>{message}</Text>
        </AlertDialog.Body>
        <ButtonNative
          mt={2}
          mb={2}
          variant="unstyled"
          color={'blue.400'}
          onPress={onClose}
          ref={cancelRef}
        >
          OK
        </ButtonNative>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
