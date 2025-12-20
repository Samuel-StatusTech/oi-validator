import { TDefaultApiRes } from "src/api/@types/responses"
import { api } from "src/api"
import { TApiTickets } from ".."

export type TApiParams_Tickets_GetWebstoreTicketDetails = {
  qrCode: string
  eventId: string
}

export type TApiResponse_Tickets_GetWebstoreTicketDetails = {
  productId: string
  productName: string
  webTicketUid: string
  isTicketCanceled: boolean
  isValidated: boolean
  validationTime: string
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
        const purchaseStatus = details.detail.status
        const cancelledStatuses = ["cancelamento", "cancelamento_pendente"]

        const ticketDetails = details.detail.products.find(
          (prod: any) => prod.qr_label === qrCode
        )

        if (ticketDetails) {
          res = {
            ok: true,
            data: {
              productId: ticketDetails.id,
              productName: ticketDetails.name, // `${ticketDetails.name} ${ticketDetails.batch_name}`
              webTicketUid: ticketDetails.opuid,
              isTicketCanceled:
                cancelledStatuses.includes(ticketDetails.status) ||
                cancelledStatuses.includes(purchaseStatus),
              isValidated: ticketDetails.status === "validado",
              validationTime: ticketDetails.validationTime ?? "",
              isOrderPayed: purchaseStatus === "validado",
            },
          }
        }
      }
    } catch (error) {
      console.log("Error getting webstore ticket details:", error)
    }

    return res
  }
