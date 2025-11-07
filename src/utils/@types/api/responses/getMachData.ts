export type MachDataRes = {
  ok: true
  data: {
    name: string
    imei: string
    code: number
    app_code: number
    status: number
    created_at: string
    updated_at: string
    org_id: string
    archived: number
    order_prefix: string
  }
} | {
  ok: false
  message: string
}
