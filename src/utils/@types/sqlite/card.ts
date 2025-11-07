export interface ICard {
  uid: string
  card_number: string
  money: number
  card: string
  cpf: string
  fone: string
  created_at: Readonly<Date>
  updated_at: Readonly<Date>
}