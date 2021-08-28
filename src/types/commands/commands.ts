import { MemberMention } from 'discord.js'

export enum MediaType {
  MOVIE = 'movie',
  SERIES = 'series',
}

export interface CommandOptions {
  name: string
  description: string
}

export interface SettingsUser {
  notify: boolean
}

export interface Settings {
  shouldPing: boolean
  users: Record<string, SettingsUser>
}

export interface MediaFile {
  title: string
  type: MediaType
  userMention: MemberMention
  username: string
  date: string
}

export type Queue = MediaFile[]
