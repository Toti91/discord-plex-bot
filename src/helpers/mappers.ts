import { MediaFile, MediaType } from '@app/types'

export type MediaRecord = Record<string, { title: string; type: MediaType }[]>

export const mapMediaItemsToRecord = (items: MediaFile[]): MediaRecord => {
  return items.reduce((c: MediaRecord, { userMention, title, type }) => {
    if (!c[userMention]) c[userMention] = [{ title, type }]
    else c[userMention].push({ title, type })
    return c
  }, {})
}
