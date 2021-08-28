import { MEDIA_QUEUE_FILE_NAME } from '@app/constants'
import { readFileSync, writeFileSync } from 'fs'

export const writeToQueueFile = (item: object) => {
  const queue = readQueueFile()
  const newQueue = queue.push(item)
  writeFileSync(MEDIA_QUEUE_FILE_NAME, JSON.stringify(newQueue))
}

export const readQueueFile = () => {
  const raw = readFileSync(MEDIA_QUEUE_FILE_NAME)
  return JSON.parse(raw.toString())
}
