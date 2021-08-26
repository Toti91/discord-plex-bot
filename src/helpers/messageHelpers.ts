import { Message } from 'discord.js'

const BACKTICKS = '```'

export const sendErrorMessage = async (message: Message, content: string) => {
  await message.channel.send(`${BACKTICKS}\n❌ ${content}${BACKTICKS}`)
}

export const sendInfoMessage = async (message: Message, content: string) => {
  await message.channel.send(`${BACKTICKS}fix\n${content}${BACKTICKS}`)
}

export const sendSuccessMessage = async (message: Message, content: string) => {
  await message.channel.send(`${BACKTICKS}\n✅ ${content}${BACKTICKS}`)
}
