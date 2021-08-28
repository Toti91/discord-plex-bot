import { PORT_PING_SETTING, SETTINGS_MENU } from '@app/constants'
import { getSettingsMenu } from '@app/helpers'
import { FileService } from '@app/services'
import { Settings } from '@app/types'
import {
  Interaction,
  SelectMenuInteraction,
  TextBasedChannels,
} from 'discord.js'

const validate = (interaction: SelectMenuInteraction) =>
  interaction.customId === SETTINGS_MENU

export const settingsMenuHandler = async (
  interaction: Interaction,
  fileService: FileService,
  channel: TextBasedChannels,
) => {
  if (!interaction.isSelectMenu() || !validate(interaction)) return

  const option = interaction.values.shift()
  const settings = await fileService.getDataFromFile<Settings>()

  if (option === PORT_PING_SETTING) {
    const updated = { ...settings, shouldPing: !settings.shouldPing }
    fileService.writeSettingsToFile(updated)

    const message = updated.shouldPing
      ? 'Stilling uppfærð: *Ég mun pinga serverinn* 📢'
      : 'Stilling uppfærð: *Ég mun __ekki__ pinga serverinn* 🔇'

    await channel.send(message)
    interaction.update({ components: [getSettingsMenu(updated.shouldPing)] })
    return
  }
}
