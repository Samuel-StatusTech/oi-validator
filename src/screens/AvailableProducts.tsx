import { useCallback, useEffect, useState } from "react"
import { Text, View, FlatList, StyleSheet } from "react-native"
import { THEME } from "../theme"
import Api from "src/api"
import { IProduct } from "@utils/@types/sqlite/product"
import { MemoizedProductListItem } from "@components/ProductListItem"
import useStore from "../store"
import { IValidation } from "@utils/@types/sqlite/validation"
import { TProductListItem } from "@utils/@types/components/ProductListItem"
import { ICombo } from "@utils/@types/sqlite/combo"
import { IWebstoreTicket } from "@utils/@types/sqlite/webstoreTicket"
import { getUserProducts } from "@utils/toolbox/auxFns/getUserProducts"

function AvailableProductsScreen() {
  const { currentEvent: event, token } = useStore((state) => state)

  const [list, setList] = useState<TProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const countValidations = (
    prods: (IProduct | ICombo | IWebstoreTicket)[],
    validations: IValidation[]
  ) => {
    let newList: TProductListItem[] = []

    let restingValidations = [...validations]
    prods.forEach((p) => {
      let productValidations = 0
      let newRestingValidations: IValidation[] = []

      restingValidations.map((v) => {
        if ((p as IProduct).id === v.ticketProductId) productValidations += 1
        else newRestingValidations.push(v)
      })

      newList.push({
        qnt: productValidations,
        name: p.name,
        msg: (p as IProduct | ICombo).description1 ?? "",
      })

      restingValidations = newRestingValidations
    })

    setList(
      newList.sort((a, b) => {
        return a.name >= b.name ? 1 : -1
      })
    )
  }

  const fetchData = async () => {
    setLoading(true)

    try {
      if (event) {
        const userProducts = await getUserProducts()

        const validations = await Api.validations.getValidations({
          syncParams: {
            hasConnection: true,
            eventId: event.id,
            token,
          },
        })

        countValidations(userProducts, validations.ok ? validations.data : [])
      }
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
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
          ListEmptyComponent={() => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  color: THEME.colors.blue[500],
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 28,
                }}
              >
                {loading
                  ? "Carregando lista..."
                  : "Você não possui nenhuma permissão no momento. Sincronize as informações e tente novamente."}
              </Text>
            </View>
          )}
          overScrollMode="never"
          initialNumToRender={32}
          maxToRenderPerBatch={64}
          windowSize={32}
          removeClippedSubviews={false}
          style={styles.flatList}
          contentContainerStyle={[
            styles.flatListContent,
            list.length === 0 && { flex: 1, justifyContent: "center" },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.gray[700],
  },
  content: {
    flex: 1,
    margin: 32,
  },
  title: {
    fontFamily: THEME.fonts.heading,
    textAlign: "center",
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.blue[500],
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
