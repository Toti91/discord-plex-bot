import { BotClient } from '@app/client'
import {
  ADD_BTN,
  CANCEL_BTN,
  PORT_PING_SETTING,
  SETTINGS_MENU,
} from '@app/constants'
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageReaction,
  MessageSelectMenu,
  User,
} from 'discord.js'

const plexReactionFilter = (
  reaction: MessageReaction,
  user: User,
  message: Message,
) => {
  return (
    (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') &&
    user.id === message.author.id
  )
}

export const mention = (id: string) => {
  return `<@${id}>`
}

export const getBotName = (client: BotClient) => {
  return client.user?.username ?? 'Plexarinn'
}

export const getButtons = ({ disabled } = { disabled: false }) => {
  const addBtn = new MessageButton()
    .setCustomId(ADD_BTN)
    .setLabel('Bæta við')
    .setStyle('PRIMARY')

  const cancelButton = new MessageButton()
    .setCustomId(CANCEL_BTN)
    .setLabel('Hætta við')
    .setStyle('SECONDARY')

  if (disabled) {
    addBtn.setDisabled()
    cancelButton.setDisabled()
  }

  return new MessageActionRow().addComponents(addBtn, cancelButton)
}

export const getCanceledButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(CANCEL_BTN)
      .setLabel(text)
      .setStyle('SECONDARY')
      .setDisabled(),
  )
}

export const getSuccessButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(ADD_BTN)
      .setLabel(text)
      .setStyle('SUCCESS')
      .setDisabled(),
  )
}

export const getErrorButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(CANCEL_BTN)
      .setLabel(text)
      .setStyle('DANGER')
      .setDisabled(),
  )
}

export const getSettingsMenu = (notify?: boolean) => {
  return new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(SETTINGS_MENU)
      .setPlaceholder('Veldu stillingu.')
      .addOptions([
        {
          label: `Server ping (${notify ? 'virkt' : 'óvirkt'})`,
          description: 'Pingar serverinn og lætur vita ef hann svarar ekki.',
          value: PORT_PING_SETTING,
          emoji: '📢',
        },
      ]),
  )
}

export const getPlexReactionOptions = (message: Message) => {
  return {
    filter: (reaction: MessageReaction, user: User) =>
      plexReactionFilter(reaction, user, message),
    max: 1,
    time: 15000,
    errors: ['time'],
    maxUsers: 1,
    maxEmojis: 1,
  }
}
