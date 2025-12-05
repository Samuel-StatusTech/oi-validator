import { TDefaultApiRes } from "../@types/responses"
import {
  getWebstoreTicketDetails,
  TApiParams_Tickets_GetWebstoreTicketDetails,
  TApiResponse_Tickets_GetWebstoreTicketDetails,
} from "./requests/getWebstoreTicketsDetails"

export const ApiTickets: TApiTickets = {
  getWebstoreTicketDetails: getWebstoreTicketDetails,
}

export type TApiTickets = {
  getWebstoreTicketDetails: (
    params: TApiParams_Tickets_GetWebstoreTicketDetails
  ) => Promise<TDefaultApiRes<TApiResponse_Tickets_GetWebstoreTicketDetails>>
}
