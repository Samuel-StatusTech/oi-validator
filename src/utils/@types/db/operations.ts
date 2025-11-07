export type OperationsTable = {
  data: Operation[]
}

export type Operation = {
  uid: string
  manager_id: string
  employee_id: string
  event_id: string
  type: string
  value: number
  created_at: number
  updated_at: number
  synced: boolean
}