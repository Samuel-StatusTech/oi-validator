import AjudaSvg from "@assets/ajuda.svg"
import UpdateSvg from "@assets/atualizar.svg"
import HistoricoSvg from "@assets/historico.svg"
import SairSvg from "@assets/sair.svg"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { AuthNavigatiorRoutesProps, Routes } from "@routes/auth.routes"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import * as Animatable from "react-native-animatable"
import { THEME } from "../theme"

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
      <View style={[styles.container, { height: isShowMenu ? '100%' : 0 }]}>
        <TouchableOpacity style={styles.menuItem} onPress={syncInfo}>
          <View style={styles.menuItemContent}>
            <UpdateSvg />
            <Text style={styles.menuText}>
              Sincronizar informações
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={prodsPress}>
          <View style={styles.menuItemContent}>
            <AjudaSvg />
            <Text style={styles.menuText}>
              Produtos disponíveis
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("qrhistory" as any)}>
          <View style={styles.menuItemContent}>
            <HistoricoSvg />
            <Text style={styles.menuText}>
              Histórico de leitura
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={popupToggle}>
          <View style={styles.menuItemContent}>
            <SairSvg />
            <Text style={styles.menuText}>
              Sair do evento
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.blue[50],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuItem: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuText: {
    fontFamily: THEME.fonts.body,
    color: THEME.colors.blue[600],
    fontSize: THEME.fontSizes.lg,
    paddingLeft: 16,
  },
  lastMenuItem: {
    marginBottom: 16,
  },
});
