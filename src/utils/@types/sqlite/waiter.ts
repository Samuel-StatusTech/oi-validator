export interface IWaiter {
  uid: string
  name: string
  status: number
  has_commission: string
  commission: number
  has_code: string
  code: string
  created_at: Readonly<Date>
  updated_at: Readonly<Date>
}
