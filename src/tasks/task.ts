import { BotClient } from '@app/client'

export class Task {
  protected client: BotClient

  constructor(client: BotClient) {
    this.client = client
  }

  public async run() {
    throw new Error(`The default task has no run() method`)
  }
}
