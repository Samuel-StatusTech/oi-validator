import AjudaSvg from "@assets/ajuda.svg"
import UpdateSvg from "@assets/atualizar.svg"
import HistoricoSvg from "@assets/historico.svg"
import SairSvg from "@assets/sair.svg"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps, Routes } from "@routes/auth.routes"
import { Box, HStack, Text } from "native-base"
import { TouchableOpacity } from "react-native"
import * as Animatable from "react-native-animatable"

type MenuTopProps = {
  isShowMenu: boolean
  prodsPress: () => void
  popupToggle: () => void
}
export function MenuTop({ isShowMenu = false, prodsPress, popupToggle }: MenuTopProps) {
  const navigation = useNavigation<AuthNavigatiorRoutesProps>()

  function nav(to: Routes) {
    navigation.navigate(to)
  }

  async function syncInfo() {
    //
  }

  return (
    <Animatable.View animation={isShowMenu ? "fadeInDownBig" : "fadeOutUpBig"}>
      <Box bg={"blue.50"} roundedBottom={"xl"} h={isShowMenu ? "full" : 0}>
        <TouchableOpacity onPress={syncInfo}>
          <HStack alignItems={"center"} justifyContent={"flex-start"} p={4}>
            <UpdateSvg />
            <Text fontFamily={"body"} color={"blue.600"} fontSize={"lg"} pl={4}>
              Sincronizar informações
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={prodsPress}>
          <HStack alignItems={"center"} justifyContent={"flex-start"} p={4}>
            <AjudaSvg />

            <Text fontFamily={"body"} color={"blue.600"} fontSize={"lg"} pl={4}>
              Produtos disponíveis
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => nav("qrhistory")}>
          <HStack alignItems={"center"} justifyContent={"flex-start"} p={4}>
            <HistoricoSvg />

            <Text fontFamily={"body"} color={"blue.600"} fontSize={"lg"} pl={4}>
              Histórico de leitura
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity onPress={popupToggle}>
          <HStack
            alignItems={"center"}
            justifyContent={"flex-start"}
            p={4}
            mb={4}
          >
            <SairSvg />

            <Text fontFamily={"body"} color={"blue.600"} fontSize={"lg"} pl={4}>
              Sair do evento
            </Text>
          </HStack>
        </TouchableOpacity>
      </Box>
    </Animatable.View>
  )
}
