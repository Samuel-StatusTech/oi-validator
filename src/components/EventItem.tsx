import { EventData } from "@utils/@types/data/event"
import { HStack, Image, Text, VStack } from "native-base"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"

type Props = {
  onSelect: () => void
  info: EventData
}

export function EventItem({ onSelect, info }: Props) {
  const getDateStr = (date: number) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0"),
      month = String(d.getMonth() + 1).padStart(2, "0"),
      year = String(d.getFullYear())

    return `${day}/${month}/${year}`
  }

  return (
    <TouchableOpacity onPress={onSelect} style={{width:'100%'}}>
      <HStack
        w={"full"}
        bg={"white"}
        height={24}
        mt={4}
        borderRadius={16}
        alignItems={"center"}
      >
        {info.logo_print ?
          <Image
            source={{
              uri: info.logo_print,
            }}
            w={100}
            height={24}
            roundedLeft={"xl"}
            alt="Foto do evento"
          />
          :
          <VStack
            w={100}
            height={24}
          />
        }

        <VStack ml={4} mr={4}>
          <Text color={"blue.600"} fontSize={"lg"} fontFamily={"heading"}>
            {info.name}
          </Text>
          <Text color={"blue.200"} fontSize={"md"}>
            {`${info.local} - ${getDateStr(info.date)}`}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
