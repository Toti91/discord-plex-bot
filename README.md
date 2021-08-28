# discord-plex-bot

To run this you will need to have two files in the /src folder

### config.json
```json
{
  "prefix": "!",
  "token": "Your Discord bot token",
  "ownerId": "Bot owner Discord user id (string)",
  "plex": {
    "adminId": "Plex admin Discord user id (string)",
    "roleId": "Discord role id (string)",
    "channelId": "Discord channel id (string)",
    "requestChannelId": "Discord request-channel id (string)",
    "clientUrl": "Plex server IP",
    "clientPort": 32400,
    "clientToken": "Plex server auth token",
    "trueNasUrl": "TrueNAS URL",
    "trueNasToken": "TrueNAS auth token",
    "radarrUrl": "Radarr URL",
    "radarrToken": "Radarr api key",
    "sonarrUrl": "Sonarr URL",
    "sonarrToken": "Sonarr api key",
    "movieFolderKey": "Your movie folder key",
    "seriesFolderKey": "Your series folder key"
  }
}
```

### media_queue.json (empty array)
```json
  []
```
