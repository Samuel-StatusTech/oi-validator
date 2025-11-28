import axios from "axios"

/* Functions Returns */
import { AuthRes } from "@utils/@types/api/responses/authenticate"
import { AllProductsRes } from "@utils/@types/api/responses/getAllProducts"
import { GetDbRes } from "@utils/@types/api/responses/getDataBase"
import { MachDataRes } from "@utils/@types/api/responses/getMachData"
import { ProductsListRes } from "@utils/@types/api/responses/getProductsList"
import { SyncUserRes } from "@utils/@types/api/responses/syncUser"
import { AllCombosRes } from "@utils/@types/api/responses/getAllCombos"
import { TicketAlrdValidRes } from "@utils/@types/api/responses/getTicketValidation"
import { TicketValidationRes } from "@utils/@types/api/responses/validateTicket"

/* Models */
import Product from "../../services/sqlite/models/Product"
import ProductList from "../../services/sqlite/models/ProductsList"
import Combo from "../../services/sqlite/models/Combo"
import Validation from "../../services/sqlite/models/Validation"
import { GetValidationsRes } from "@utils/@types/api/responses/getValidations"
import { UploadSyncRes } from "@utils/@types/api/responses/uploadSync"
import { IValidation } from "@utils/@types/sqlite/validation"
import WebstoreTicket from "@services/sqlite/models/WebstoreTicket"
import { AllWebstoreTicketsRes } from "@utils/@types/api/responses/getAllWebstoreTickets"
import { TicketDetailsRes } from "@utils/@types/api/responses/ticketDetails"

const na = axios.create({
  baseURL: "https://api.oitickets.com.br/api/v1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})

const a = axios.create({
  baseURL: "https://api.oitickets.com.br/api/v1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})

const getDatabase = async (imei: number): Promise<GetDbRes> => {
  let res: GetDbRes = { ok: false, message: "" }

  try {
    const req = await a.post(`/imeidatabase`, { imei })

    const data = await req.data

    if (data.success) {
      res = {
        ok: true,
        data: {
          client: data.client,
          expireAt: data.expireAt,
          status: data.status,
        },
      }
    } else {
      res.message =
        "Imei não cadastrado. Por favor, faça o cadastro e tente novamente"
    }
  } catch (error) {
    res = {
      ok: false,
      message: "Houve um erro. Tente novamente mais tarde",
    }
  }

  return res
}

const authenticate = async (
  username: string,
  password: string,
  db: string
): Promise<AuthRes> => {
  let res: AuthRes = { ok: false, message: "" }

  try {
    const req = await (
      await a.post(`/authenticate`, {
        username,
        password,
        database: db,
      })
    ).data

    if (req.success) {
      res = {
        ok: true,
        data: { ...req },
      }
      a.defaults.headers.common.Authorization = `Bearer ${req.token}`
    } else {
      res.message = req.error
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}

const getMachData = async (
  imei: number,
  token: string
): Promise<MachDataRes> => {
  let res: MachDataRes = { ok: false, message: "" }

  try {
    const req = await (await a.get(`/device/getDataByImei/${imei}`)).data

    if (req.imei) {
      res = {
        ok: true,
        data: { ...req },
      }
    } else {
      res.message = req ?? ""
    }
  } catch (error) {
    res = {
      ok: false,
      message: "",
    }
  }

  return res
}

const syncUser = async (
  orgId: string,
  userId: string,
  eventId: null | string,
  lastSync: number,
  token: string
): Promise<SyncUserRes> => {
  let res: SyncUserRes = { ok: false, message: "" }

  try {
    const req = await a.get(`/sync/v2-1/download`, {
      params: {
        org_id: orgId,
        user_id: userId,
        lastSync,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (req.status === 200) {
      const sync = await req.data
      res = {
        ok: true,
        data: sync,
      }
    }

    if (eventId) {
      const req2 = await na
        .get(`/ecommerce/product/getList?eventId=${eventId}`)
        .catch((err) => err)

      if (req2.status === 200) {
        const sync = req2.data

        if (sync && res.ok) {
          res.data.productsData.webstore_tickets = sync
        }
      }
    }
  } catch (error) {
    console.log("Error", error)
  }

  return res
}

const getProductsList = async (): Promise<ProductsListRes> => {
  let res: ProductsListRes = { ok: false, message: "" }

  const prods = (await ProductList.getLists()) ?? []
  res = { ok: true, data: prods }

  return res
}

const getAllProducts = async (
  categories: string[]
): Promise<AllProductsRes> => {
  let res: AllProductsRes = { ok: false, message: "" }

  const prods = (await Product.getUserProducts(categories)) ?? []
  res = { ok: true, data: prods }

  return res
}

const getAllWebstoreTickets = async (): Promise<AllWebstoreTicketsRes> => {
  let res: AllWebstoreTicketsRes = { ok: false, message: "" }

  const webstoreTickets = (await WebstoreTicket.getEventWebstoreTicket()) ?? []
  res = { ok: true, data: webstoreTickets }

  return res
}

const getAllCombos = async (): Promise<AllCombosRes> => {
  let res: AllCombosRes = { ok: false, message: "" }

  const combos = (await Combo.getAllCombos()) ?? []
  res = { ok: true, data: combos }

  return res
}

const getTicketValidation = async (
  ticketUid: string
): Promise<TicketAlrdValidRes> => {
  let res: TicketAlrdValidRes = { ok: false, message: "" }

  const validations = (await Validation.searchByTicket(ticketUid)) ?? []
  const isAlreadyValidated = validations.length > 0
  res = { ok: true, data: isAlreadyValidated }

  return res
}

const getOnlineValidations = async (
  eventId: string,
  token: string
): Promise<GetValidationsRes> => {
  let res: GetValidationsRes = { ok: false, message: "" }

  try {
    const sv = await a
      .get(`/validations/overview/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Api-Token": `Bearer ${token}`,
        },
      })
      .then(async (res) => (await res.data()) as IValidation[])

    res = { ok: true, data: sv }
  } catch (error) {
    console.log("Error fetching online validations:", error)
  }

  return res
}

const getValidations = async (
  hasConnection: boolean,
  eventId: string,
  token: string
): Promise<GetValidationsRes> => {
  let res: GetValidationsRes = { ok: false, message: "" }

  let syncedValidations: IValidation[] = []
  if (hasConnection) {
    try {
      const sv = await a
        .get(`/validations/overview/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Api-Token": `Bearer ${token}`,
          },
        })
        .then(async (res) => (await res.data()) as IValidation[])

      syncedValidations = sv
    } catch (error) {}
  }

  const localValidations = await Validation.getAll()

  const validations = [...syncedValidations, ...localValidations]

  res = { ok: true, data: validations }

  return res
}

const getWebstoreTicketDetails = async (
  qrCode: string,
  eventId: string,
  token: string
): Promise<TicketDetailsRes> => {
  let res: TicketDetailsRes = { ok: false, message: "" }

  const details = await a
    .request({
      method: "get",
      url: `/${eventId}/validate_ticket/${qrCode}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => err)

  const requestSuccess = details.status ?? false

  if (requestSuccess) {
    const ticketDetails = details.detail.products.find(
      (prod: any) => prod.qr_label === qrCode
    )

    if (ticketDetails) {
      res = {
        ok: true,
        data: {
          webTicketUid: ticketDetails.opuid,
        },
      }
    }
  }

  return res
}

const validateTicket = async (
  ticketUid: string,
  eventId: string,
  token: string
): Promise<TicketValidationRes> => {
  let res: TicketValidationRes = { ok: false, message: "" }

  const validation = await (
    await a.request({
      method: "put",
      maxBodyLength: Infinity,
      url: "/validator/updateTicket",
      data: `ticketUid=${ticketUid}&event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data

  res = { ok: true, data: validation.status }

  return res
}

const uploadSync = async (data: {
  orders: any[]
  products: any[]
  operations: any[]
  token: string
}): Promise<UploadSyncRes> => {
  let res: UploadSyncRes = { ok: false, message: "" }

  try {
    const upload = await a.post(
      "/sync/v2-1/upload",
      {
        orders: data.orders,
        products: data.products,
        operations: data.operations,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    )

    if (upload.status === 200)
      res = {
        ok: await upload.data.success,
        data: await upload.data,
      }
  } catch (error) {}

  return res
}

const Api = {
  getDatabase,
  authenticate,
  getMachData,
  syncUser,
  getProductsList,
  getAllProducts,
  getAllWebstoreTickets,
  getAllCombos,
  getWebstoreTicketDetails,
  getTicketValidation,
  getOnlineValidations,
  validateTicket,
  getValidations,
  uploadSync,
}

export default Api
