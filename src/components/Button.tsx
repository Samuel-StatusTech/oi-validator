import {
  Button as ButtonNative,
  IButtonProps,
  Spinner,
  Text,
} from 'native-base';

type Props = IButtonProps & {
  title: string;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export function Button({
  title,
  isLoading = false,
  isDisabled = false,
  ...rest
}: Props) {
  const disable = isDisabled || isLoading;

  return (
    <ButtonNative
      bg={'blue.400'}
      w={'full'}
      h={16}
      isDisabled={disable}
      {...rest}
      rounded={'full'}
      _pressed={{
        bg: 'blue.300',
      }}
      _disabled={{
        bg: 'blue.50',
        opacity: 100,
      }}
    >
      {isLoading ? (
        <Spinner color={'blue.200'} />
      ) : (
        <Text
          color={isDisabled ? 'blue.200' : 'white'}
          fontFamily={'heading'}
          fontSize={'sm'}
        >
          {title}
        </Text>
      )}
    </ButtonNative>
  );
}
