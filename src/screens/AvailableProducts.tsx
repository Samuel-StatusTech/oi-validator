import { useEffect, useState } from "react"
import { Text, VStack, FlatList } from "native-base"
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
    <VStack h={"full"}>
      <VStack flex={1} margin={"32px"}>
        <Text
          fontFamily={"heading"}
          textAlign={"center"}
          fontSize={"lg"}
          color={"blue.600"}
          marginX={18}
          marginBottom={"32px"}
        >
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
          height={"50%"}
          width={"100%"}
          overScrollMode="never"
          style={{ paddingRight: 16 }}
          contentContainerStyle={{ rowGap: 16 }}
        />
      </VStack>
    </VStack>
  )
}

export default AvailableProductsScreen
