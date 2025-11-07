import { FormControl, IInputProps, Input as InputNative } from "native-base"

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} mb={2}>
      <InputNative
        variant="filled"
        placeholderTextColor={"blue.200"}
        color={!invalid ? "blue.600" : "red.500"}
        size={"xl"}
        h={16}
        mt={6}
        rounded={"xl"}
        backgroundColor={!invalid ? "blue.50" : "red.50"}
        isInvalid={invalid}
        _invalid={{ borderWidth: 0 }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
