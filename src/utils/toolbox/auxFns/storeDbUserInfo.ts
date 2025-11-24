import { SyncInfo } from "@utils/@types/api/responses/syncUser"
import Product from "@services/sqlite/models/Product"
import ProductsList from "@services/sqlite/models/ProductsList"
import Combo from "@services/sqlite/models/Combo"
import { createTables } from "@services/sqlite/Database"
import Event from "@services/sqlite/models/Events"
import WebstoreTicket from "@services/sqlite/models/WebstoreTicket"

export const storeDbUserInfo = async (
  kInfo: SyncInfo,
  role: "start" | "update" = "update"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (kInfo) {
        const { eventsData: events, orders } = kInfo

        const {
          products,
          product_lists,
          combos,
          webstore_tickets = [],
        } = kInfo.productsData

        // if (role === "start") ...

        await createTables()

        await Event.insertEvents(events)

        await Product.insertProducts(products)

        await ProductsList.insertList(product_lists)

        await Combo.insertCombos(combos)

        await WebstoreTicket.insertWebstoreTickets(webstore_tickets)

      }
      resolve(true)
    } catch (error) {
      reject("Houve um erro")
    }
  })
}
