import { TDefaultApiRes } from "src/api/@types/responses"
import { api } from "src/api"
import { TApiTickets } from ".."

export type TApiParams_Tickets_GetWebstoreTicketDetails = {
  qrCode: string
  eventId: string
}

export type TApiResponse_Tickets_GetWebstoreTicketDetails = {
  productId: string
  webTicketUid: string
  isTicketCanceled: boolean
  isValidated: boolean
  isOrderPayed: boolean
}

export const getWebstoreTicketDetails: TApiTickets["getWebstoreTicketDetails"] =
  async ({ eventId, qrCode }) => {
    let res: TDefaultApiRes<TApiResponse_Tickets_GetWebstoreTicketDetails> = {
      ok: false,
      message: "",
    }

    try {
      const details = await api
        .request({
          method: "get",
          url: `/${eventId}/validate_ticket/${qrCode}`,
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
              productId: ticketDetails.id,
              webTicketUid: ticketDetails.opuid,
              isTicketCanceled:
                ticketDetails.status === "cancelamento" ||
                ticketDetails.status === "cancelamento_pendente",
              isValidated: ticketDetails.status === "validado",
              isOrderPayed: details.detail.status === "validado",
            },
          }
        }
      }
    } catch (error) {
      console.log("Error getting webstore ticket details:", error)
    }

    return res
  }
