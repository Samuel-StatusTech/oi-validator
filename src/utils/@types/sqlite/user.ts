export interface IUser {
  uid: string
  org_id: string
  username: string
  name: string
  email: string
  password: string
  role: TOperatorRole
  status: number
  created_at: Readonly<Date>
  updated_at: Readonly<Date>
  phone: string
}

type TOperatorRole = "OPERATOR" | "MANAGER"
