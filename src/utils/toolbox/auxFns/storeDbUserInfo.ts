import { SyncInfo } from "@utils/@types/api/responses/syncUser"
import Product from "@services/sqlite/models/Product"
import ProductsList from "@services/sqlite/models/ProductsList"
import Combo from "@services/sqlite/models/Combo"
import { createTables } from "@services/sqlite/Database"
import Event from "@services/sqlite/models/Events"

export const storeDbUserInfo = async (kInfo: SyncInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (kInfo) {
        const { eventsData: events, orders } = kInfo

        const {
          products,
          product_lists,
          combos,
          complements,
          groups,
          group_lists,
        } = kInfo.productsData

        await createTables()

        await Event.insertEvents(events)

        await Product.insertProducts(products)

        await ProductsList.insertList(product_lists)

        await Combo.insertCombos(combos)

        // register complements -> [complements model].create
        // console.log("complements", complements)

        // register groups -> [groups model].create
        // console.log("groups", groups)

        // register groupLists -> [groupLists model].create
        // console.log("groupLists", group_lists)
      }
      resolve(true)
    } catch (error) {
      reject("Houve um erro")
    }
  })
}
