export type UsersTable = {
  data: User[]
}

export type User = {
  uid: string
  org_id: string
  username: string
  name: string
  email: string
  password: string
  role: string
  status: boolean
  created_at: number
  updated_at: number
  phone: string
}