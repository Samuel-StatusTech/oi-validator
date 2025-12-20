export const formatLocalDate = (date: number) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0"),
    month = String(d.getMonth() + 1).padStart(2, "0"),
    year = String(d.getFullYear())

  return `${day}/${month}/${year}`
}

export const formatLocalTime = (date: number) => {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, "0"),
    minutes = String(d.getMinutes()).padStart(2, "0"),
    seconds = String(d.getSeconds()).padStart(2, "0")

  return `${hours}:${minutes}:${seconds}`
}

export const formatLocalDateTime = (date: number) => {
  const dateString = formatLocalDate(date)
  const timeString = formatLocalTime(date)

  return `${dateString} ${timeString}`
}
