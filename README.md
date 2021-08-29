# discord-plex-bot

A Discord bot that uses Radarr and Sonarr to request movies / tv-shows on your Plex server.

Features:
- Add series or movies
- Let's you know when the media is available on your Plex server
- Let's Plex admin know if the media was not added
- Pin's ports on the server and let's admin know if they don't respond.

## Example

![image](https://user-images.githubusercontent.com/16031201/131261376-e65da8aa-ea5f-43e2-ae6a-8d12ea988370.png)

## To run this you will need to have these files in the /src folder

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
    "baseUrl": "Base IP address of server e.g. xx.xx.xx.xx",
    "clientPort": 32400,
    "clientToken": "Plex server auth token",
    "trueNasUrl": "api/v2.0",
    "trueNasToken": "TrueNAS auth token",
    "trueNasPort": 80,
    "radarrPort": 7878,
    "radarrToken": "Radarr api key",
    "sonarrPort": 8989,
    "sonarrToken": "Sonarr api key",
    "movieFolderKey": "Your movie folder key",
    "seriesFolderKey": "Your series folder key"
  }
}
```

### settings.json
```json
 {
  "shouldPing": true,
  "users": {}
 }
``` 

### media_queue.json (empty array)
```json
  []
```
