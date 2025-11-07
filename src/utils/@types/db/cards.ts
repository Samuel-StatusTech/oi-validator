export type CardsTable = {
  data: Card[]
}

export type Card = {
  uid: string
  card_number: string
  money: number
  card: number
  cpf: string
  fone: string
  created_at: number
  updated_at: number
}