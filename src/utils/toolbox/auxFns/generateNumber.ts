export const generateNumber = () => {
  const time = new Date().getTime()
  const random = Math.round(Math.random() * 1000)
  const number = Number(`${time}${random}`)
  return number
}
