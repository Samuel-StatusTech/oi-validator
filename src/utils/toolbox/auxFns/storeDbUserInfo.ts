import Product from "@services/sqlite/models/Product"
import ProductsList from "@services/sqlite/models/ProductsList"
import Combo from "@services/sqlite/models/Combo"
import { createTables, dropTables } from "@services/sqlite/Database"
import Event from "@services/sqlite/models/Event"
import WebstoreTicket from "@services/sqlite/models/WebstoreTicket"

export const storeDbUserInfo = async (
  kInfo: any,
  role: "start" | "update" = "update"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (kInfo) {
        const { eventsData: events } = kInfo

        const {
          products,
          product_lists,
          combos,
          webstore_tickets = [],
        } = kInfo.productsData

        if (role === "start") {
          await createTables()
          await Event.insertEvents(events)
          await Product.insertProducts(products)
          await ProductsList.insertProductsLists(product_lists)
          await Combo.insertCombos(combos)
          await WebstoreTicket.insertWebstoreTickets(webstore_tickets)
        } else if (role === "update") {
          await Event.updateEvents(events)
          await Product.updateProducts(products)
          await ProductsList.updateProductsLists(product_lists)
          await Combo.updateCombos(combos)
          await WebstoreTicket.updateWebstoreTickets(webstore_tickets)
        }
      }
    } catch (error) {
      reject("Houve um erro")
      return
    }

    resolve(true)
  })
}
