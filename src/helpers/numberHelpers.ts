export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const secondsToDays = (value: number) => {
  const d = Math.floor(value / (3600 * 24))
  const h = Math.floor((value % (3600 * 24)) / 3600)
  const m = Math.floor((value % 3600) / 60)
  const s = Math.floor(value % 60)

  const days = d > 0 ? `${d} ${d === 1 ? 'dagur, ' : 'dagar, '}` : ''
  const hours = h > 0 ? `${h} klst, ` : ''
  const minutes = m > 0 ? `${m} mín, ` : ''
  const seconds = s > 0 ? `${s} sek` : ''

  return `${days}${hours}${minutes}${seconds}`
}
