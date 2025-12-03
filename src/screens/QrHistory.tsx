import { useCallback, useEffect, useState } from "react"
import { FlatList, Text, View, StyleSheet } from "react-native"
import { THEME } from "../theme"
import { QrHistoryItem } from "@components/QrHistoryItem"

import { TQrHistoryItem } from "@utils/@types/components/QrHistoryItem"
import Api from "@utils/api"
import useStore from "../store"
import { IValidation } from "@utils/@types/sqlite/validation"
import { getTicketsNames } from "@utils/toolbox/auxFns/getTicketNames"
import QrHistoryEmpty from "@components/QrHistoryEmpty"

export function QrHistory() {
  const { user } = useStore((state) => state)
  const event = useStore((state) => state.currentEvent)

  const [data, setData] = useState<TQrHistoryItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const parseList = (list: IValidation[]): TQrHistoryItem[] => {
    let nl: TQrHistoryItem[] = []

    for (let i = 0; i < list.length; i++) {
      const validation = list[i]
      nl.push({
        code: validation.ticketReadableCode ?? validation.uid,
        date: validation.created_at,
        name: validation.name ?? "",
      })
    }

    return nl
  }

  const updateList = async () => {
    if (user && event) {
      const list = await Api.getValidations()

      if (list.ok) {
        const listWithProdsNames = await getTicketsNames(list.data, user)
        const nl = parseList(listWithProdsNames)
        const orderedData = nl.sort((a, b) => {
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
        })
        setData(orderedData)
      }
    }
  }

  const reloadList = useCallback(async () => {
    setRefreshing(true)
    await updateList()
    setRefreshing(false)
  }, [])

  useEffect(() => {
    updateList()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Este é o seu histórico de códigos escaneados neste evento.
        </Text>

        <FlatList
          refreshing={refreshing}
          onRefresh={reloadList}
          data={data}
          renderItem={({ item }) => <QrHistoryItem info={item} />}
          ListEmptyComponent={() => <QrHistoryEmpty />}
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
