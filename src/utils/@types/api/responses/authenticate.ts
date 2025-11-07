export type AuthRes = {
  ok: true
  data: {
    token: string
    roleData: any
    user: any
  }
} | {
  ok: false,
  message: string
}