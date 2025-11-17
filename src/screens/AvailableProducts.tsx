import { useEffect, useState } from "react"
import { Text, View, FlatList, StyleSheet } from "react-native"
import { THEME } from "../theme"
import Api from "@utils/api"
import { IProduct } from "@utils/@types/sqlite/product"
import { ProductListItem } from "@components/ProductListItem"
import useStore from "../store"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TProductListItem } from "@utils/@types/components/ProductListItem"
import { useNetInfo } from "@react-native-community/netinfo"

function AvailableProductsScreen() {
  const { currentEvent: event, user, token } = useStore((state) => state)

  const [list, setList] = useState<TProductListItem[]>([])

  const countValidations = (prods: IProduct[], validations: IValidation[]) => {
    let nl: TProductListItem[] = []

    let restingValidations = [...validations]
    prods.forEach((p) => {
      const n = restingValidations.filter((v) => {
        const ticketId = v.uid
        const prodOId = ticketId.substring(7, 10)
        const prodInId = parseInt(String(p.o_id ?? ""))
          .toString(36)
          .padStart(3, "0")
          .slice(0, 3)
          .toUpperCase()

        return prodOId === prodInId
      }).length

      if (p.name !== p.id)
        nl.push({
          qnt: n,
          name: p.name,
          msg: p.description1,
        })
    })

    setList(
      nl.sort((a, b) => {
        return a.name >= b.name ? 1 : -1
      })
    )
  }

  const fetchData = async () => {
    if (event) {
      const products = await Api.getAllProducts(
        user?.roleInfo.product_types ?? []
      )
      const validations = await Api.getValidations(true, event.id, token)
      if (products.ok && validations.ok) {
        countValidations(products.data, validations.data)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Estes são os tipos de código que você pode escanear neste evento:
        </Text>

        <FlatList
          data={list}
          renderItem={({ item }) => (
            <ProductListItem
              info={{
                msg: item.msg ?? "",
                name: item.name,
                qnt: item.qnt,
                id: item.id,
              }}
            />
          )}
          overScrollMode="never"
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    margin: 32,
  },
  title: {
    fontFamily: THEME.fonts.heading,
    textAlign: 'center',
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.blue[600],
    marginHorizontal: 18,
    marginBottom: 32,
  },
  flatList: {
    paddingRight: 16,
  },
  flatListContent: {
    rowGap: 16,
  },
})

export default AvailableProductsScreen
