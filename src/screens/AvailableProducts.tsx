import { useCallback, useEffect, useState } from "react"
import { Text, View, FlatList, StyleSheet } from "react-native"
import { THEME } from "../theme"
import Api from "@utils/api"
import { IProduct } from "@utils/@types/sqlite/product"
import { MemoizedProductListItem } from "@components/ProductListItem"
import useStore from "../store"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TProductListItem } from "@utils/@types/components/ProductListItem"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"

function AvailableProductsScreen() {
  const { currentEvent: event, user, token } = useStore((state) => state)

  const [list, setList] = useState<TProductListItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const countValidations = (
    prods: (IProduct | ICombo | IWebstoreTicket)[],
    validations: IValidation[]
  ) => {
    let nl: TProductListItem[] = []

    let restingValidations = [...validations]
    prods.forEach((p) => {
      const n = restingValidations.filter((v) => {
        const ticketId = v.uid
        const prodOId = ticketId.substring(7, 10)
        const prodInId = parseInt(String((p as IProduct | ICombo).oid ?? ""))
          .toString(36)
          .padStart(3, "0")
          .slice(0, 3)
          .toUpperCase()

        return (
          prodOId === prodInId ||
          v.ticketProductId === (p as IWebstoreTicket).product_id
        )
      }).length

      if (
        p.name !== (p as IProduct | ICombo).id &&
        p.name !== (p as IWebstoreTicket).product_id
      )
        nl.push({
          qnt: n,
          name: p.name,
          msg: (p as IProduct | ICombo).description1 ?? "",
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
      let pdvProductsList: IProduct[] = []
      let pdvCombosList: ICombo[] = []
      let webstoreList: IWebstoreTicket[] = []

      const products = await Api.getAllProducts(
        user?.roleInfo.product_types ?? []
      )

      if (products.ok) {
        pdvProductsList = products.data
      }

      const combos = await Api.getAllCombos()

      if (combos.ok) {
        pdvCombosList = combos.data
      }

      if (
        user?.roleInfo.product_types?.includes("ingresso") ||
        user?.roleInfo.has_product_list !== 0
      ) {
        const webTickets = await Api.getAllWebstoreTickets()

        if (webTickets.ok) {
          webstoreList = webTickets.data
        }
      }

      const validations = await Api.getValidations({
        hasConnection: true,
        eventId: event.id,
        token,
      })
      if (products.ok && validations.ok) {
        countValidations(products.data, validations.data)
      }
    }
  }

  const reloadList = useCallback(async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }, [])

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
          refreshing={refreshing}
          onRefresh={reloadList}
          data={list}
          renderItem={({ item }) => (
            <MemoizedProductListItem
              info={{
                msg: item.msg ?? "",
                name: item.name,
                qnt: item.qnt,
                id: item.id,
              }}
            />
          )}
          overScrollMode="never"
          initialNumToRender={32}
          maxToRenderPerBatch={64}
          windowSize={32}
          removeClippedSubviews={false}
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
    textAlign: "center",
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
