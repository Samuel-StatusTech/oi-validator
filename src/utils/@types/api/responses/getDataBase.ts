export type GetDbRes = {
  ok: true
  data: {
    client: string
    expireAt: number
    status: boolean
  }
} | {
  ok: false,
  message: string
}