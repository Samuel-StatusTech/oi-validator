import AsyncStorage from "@react-native-async-storage/async-storage"
import { StoreInterface } from "@utils/@types/store"

const getData = async (
  key?: string
): Promise<StoreInterface | Partial<StoreInterface> | null | string> => {
  const storage = AsyncStorage

  return new Promise(async (resolve) => {
    if (key) {
      const d = await storage.getItem(key)
      let data = null
      if (d) {
        //
        try {
          data = JSON.parse(d)
        } catch (error) {
          if (typeof d === "string") data = d
        }
        // data = d ? JSON.parse(d) : typeof d === "string" ? d : undefined
      }

      resolve(data)
    } else {
      const keys = await storage.getAllKeys()

      let d = {}

      for (const k of keys) {
        d = {
          ...d,
          [k]: await storage.getItem(k),
        }
      }
      resolve(d)
    }
  })
}

const getIMEI = async (): Promise<string | null> => {
  const storage = AsyncStorage

  return new Promise(async (resolve) => {
    const d = await storage.getItem("IMEI")
    resolve(d)
  })
}

const setIMEI = async (number: number) => {
  const storage = AsyncStorage
  await storage.setItem("IMEI", String(number))
}

const setData = async (key: string, value: string) => {
  const storage = AsyncStorage

  return new Promise(async (resolve) => {
    const pData = await getData(key)
    if (pData) await deleteData(key)
    await storage.setItem(key, value)
    resolve(true)
  })
}

const deleteData = async (key: string) => {
  const storage = AsyncStorage

  return new Promise(async (resolve) => {
    if (key !== "IMEI") await storage.removeItem(key)
    resolve(true)
  })
}

export { getData, setData, deleteData, getIMEI, setIMEI }
