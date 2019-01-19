# ISteamUserStats

Game statistics related APIs; achievements, scores, stats, etc.

<br />

| Method | Description |
| :--- | :--- |
| [GetGlobalAchievementPercentagesForApp](#GetGlobalAchievementPercentagesForApp) | The percentage of app owners with the specific achievements. |
| [GetNumberOfCurrentPlayers](#GetNumberOfCurrentPlayers) | The current number of online players for a specific game. |
| [GetPlayerAchievements](#GetPlayerAchievements) | Get game achievement completion stats for a player. |
| [GetSchemaForGame](#GetSchemaForGame) | Retrieve detailed information about the stats and achievements for a game. |
| [GetUserStatsForGame](#GetUserStatsForGame) | Get game stats for a user. |

<br />

## GetGlobalAchievementPercentagesForApp
<sub>[[to top of page]](#ISteamUserStats)</sub>

**Does *NOT* require an API Key! Yay!**

The percentage of app owners with the specific achievements. Not a substitute for actual achievements in the game, as some games have "ghost" achievements that can appear in this API, but are not visible in the real achievement list, no longer attainable, or even deleted after initial creation. You can safely assume that any achievements with a 0% unlock rate are "ghost" achievements, and should not use them for statistics.
### Syntax
`getGlobalAchievements(appid)`
### Parameters

`appid` *required*
> Type: `Integer`  
>  
> Steam internal app id, can also be a string


### Result

> **Object `achievements`**  
> Achievement percentages listed by API name. You should ignore any achievements with a 0% unlock rate, read above about "ghost" achievements.  

### Example

```javascript
const api = require('steam-js-api')

api.getGlobalAchievements(730).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "achievements": {
        "GIVE_DAMAGE_LOW": 86.1,
        "KILL_ENEMY_RELOADING": 86.1,
        "UNSTOPPABLE_FORCE": 85.3,
        "KILL_ENEMY_LOW": 84.4,
        "WIN_ROUNDS_LOW": 83,
        "KILL_LOW_DAMAGE": 81.4,
        "EARN_MONEY_LOW": 80.3,
        "IMMOVABLE_OBJECT": 80.3,
        "": 0
    }
}
```

## GetNumberOfCurrentPlayers
<sub>[[to top of page]](#ISteamUserStats)</sub>

**Does *NOT* require an API Key! Yay!**

The current number of online players for a specific game.
### Syntax
`getCurrentPlayers(appid)`
### Parameters

`appid` *required*
> Type: `Integer`  
>  
> Steam internal app id, can also be a string


### Result

> **Integer `players`**  
> Total online players  

### Example

```javascript
const api = require('steam-js-api')

api.getCurrentPlayers(730).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "players": 569199
}
```

## GetPlayerAchievements
<sub>[[to top of page]](#ISteamUserStats)</sub>

Get game achievement completion stats for a player.
### Syntax
`getAchievements(steamID, appid)`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`appid` *required*
> Type: `Integer`  
>  
> Steam internal app id, can also be a string


### Result

> **String `name`**  
> Full name of the game  
>
> **Integer `count`**  
> Total number of achievements in the game  
>
> **Object `achievements`**  
> Achievement objects listed by internal achievement name  
>> **Boolean `unlocked`**  
>> Whether or not the achievement has been unlocked  
>
>> **Integer `time`**  
>> Time the achievement was unlocked, in seconds since the epoch.  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getAchievements('76561198099490962', 264710).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "name": "Subnautica",
    "count": 4,
    "achievements": {
        "DiveForTheVeryFirstTime": {
            "unlocked": true,
            "time": 1516378680
        },
        "RepairAuroraReactor": {
            "unlocked": false,
            "time": 0
        },
        "BuildSeamoth": {
            "unlocked": true,
            "time": 1516777135
        },
        "HatchCutefish": {
            "unlocked": false,
            "time": 0
        }
    }
}
```

## GetSchemaForGame
<sub>[[to top of page]](#ISteamUserStats)</sub>

Retrieve detailed information about the stats and achievements for a game. Keep in mind that Steam doesn't seem to publicly display any stats other than achievements, despite it being tracked. Thanks Volvo.
### Syntax
`getGameSchema(appid)`
### Parameters

`appid` *required*
> Type: `Integer`  
>  
> Steam internal app id, can also be a string


### Result

> **String `name`**  
> Full name of the game  
>
> **Integer `statCount`**  
> Total number of tracked stats in the game  
>
> **Integer `achievementCount`**  
> Total number of achievements in the game  
>
> **Object `stats`**  
> Stat objects listed by internal stat name  
>> **String `displayName`**  
>> String representation of the stat, is NOT guaranteed to be different from the internal api name  
>
>> **Integer `default`**  
>> The default value of the stat  
>
> **Object `achievements`**  
> Achievement objects listed by internal achievement name  
>> **String `displayName`**  
>> String representation of the achievement, same as the name shown on individual achievement pages  
>
>> **String `description`**  
>> String description of the achievement, will be empty if the achievement is hidden. This often describes exactly how to get the achievement, which is why hidden achievements do not return this in the api.  
>
>> **Boolean `hidden`**  
>> Whether or not the achievement is a secret (hidden) achievement  
>
>> **String `icon`**  
>> The full url to the unlocked icon image  
>
>> **String `iconLocked`**  
>> The full url to the locked icon image, seems to be standard that this is just the unlocked version in gray-scale color  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getGameSchema(264710).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "name": "Subnautica",
    "statCount": 3,
    "achievementCount": 3,
    "stats": {
        "s1_AllTimeDepth": {
            "displayName": "Max all time depth",
            "default": 0
        },
        "s2_HasTank": {
            "displayName": "Player has crafted tank",
            "default": 0
        },
        "s3_FeedbackSubmit": {
            "displayName": "Player has submitted feedback",
            "default": 0
        }
    },
    "achievements": {
        "DiveForTheVeryFirstTime": {
            "displayName": "Getting Your Feet Wet",
            "description": "",
            "hidden": true,
            "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/89b61cdeb0e1b6d22532245ce394f00d0a4277e1.jpg",
            "iconLocked": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/680214ffd7727865ea404b897aecbc0f667a9377.jpg"
        },
        "RepairAuroraReactor": {
            "displayName": "Extinction Event Avoided",
            "description": "",
            "hidden": true,
            "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/1c59192a1e1ce720cd3dc77a1ea4e663f1f5516f.jpg",
            "iconLocked": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/680214ffd7727865ea404b897aecbc0f667a9377.jpg"
        },
        "HatchCutefish": {
            "displayName": "\"Man's Best Friend\"",
            "description": "",
            "hidden": true,
            "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/7e5b3420b69b9077e7d068dc6f9c646725577599.jpg",
            "iconLocked": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/680214ffd7727865ea404b897aecbc0f667a9377.jpg"
        }
    }
}
```

## GetUserStatsForGame
<sub>[[to top of page]](#ISteamUserStats)</sub>

Get game stats for a user. These are internally defined by the game developer, and they are responsible for actually updating the stats. Also, Steam lags behind when stats are updated, so you simply can't rely on these stats updating in a timely manner. Trust me, I'm speaking from experience on this.

Please know that certain games have a custom object structure defined, so you need to check these pages for the data point names, rather than what the Steam API says:

* [Counter-Strike: Global Offensive](Stats-CSGO)
### Syntax
`getStats(steamID, appid)`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`appid` *required*
> Type: `Integer`  
>  
> Steam internal app id, can also be a string


### Result

> **String `name`**  
> Full name of the game  
>
> **Integer `count`**  
> Total number of stats returned, will likely be less than the number defined in the game schema  
>
> **Object `stats`**  
> Stats listed by their original Web API name. **NOTICE!** Some games have custom object definitions, bulleted above.  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getStats('76561198099490962', 264710).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "name": "Subnautica",
    "count": 2,
    "stats": {
        "s1_AllTimeDepth": 84,
        "s2_HasTank": 1
    }
}
```

