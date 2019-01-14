# IPlayerServices

Specifically playtime, owned games, badges, and Steam level. For player summaries, bans and friend list, go to [ISteamUser](ISteamUser)

<br />

| Method | Description |
| :--- | :--- |
| [GetRecentlyPlayedGames](#GetRecentlyPlayedGames) | Get information about games the user has played within the last 2 weeks. |
| [GetOwnedGames](#GetOwnedGames) | Retrieve a list of all games the user has ever bought or installed (free-to-play). |
| [GetSteamLevel](#GetSteamLevel) | Get the current Steam Level of the user, and absolutely nothing more. |
| [GetBadges](#GetBadges) | Get all badges the user currently has, and some detailed level information. |
| [GetCommunityBadgeProgress](#GetCommunityBadgeProgress) | Returns the badge progress for specific task-based badges. |

<br />

## GetRecentlyPlayedGames
<sub>[[to top of page]](#IPlayerServices)</sub>

Get information about games the user has played within the last 2 weeks.
### Syntax
`getRecentlyPlayedGames(steamID[, count])`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`count`
> Type: `Integer`  
> Default: `0`  
>  
> Number of recently played games to return. Unset or 0 will return all recently played games


### Result

> **Integer `count`**  
> Number of returned games  
>  
> **Array `games`**  
> Array of objects containing information about recently played games  
>> **String `name`**  
>> Full name of the game  
>  
>> **Integer `appid`**  
>> Steam internal app id, always unique  
>  
>> **Integer `playtime`**  
>> Total game playtime in minutes  
>  
>> **Integer `playtime_recent`**  
>> Game playtime in minutes over the last 2 weeks  
>  
>> **String `url_store`**  
>> Basic url to store page, url is not canonical (name is not in url)  
>  
>> **String `url_store_header`**  
>> Basic url to header image for Steam store page, url stays the same but the resulting image can change frequently  
>  
>> **String `url_app_logo`**  
>> Url to app logo, seems to always be 184x69 pixels and never changes  
>  
>> **String `url_app_icon`**  
>> Url to app icon, seems to always be 32x32 pixels and never changes  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getRecentlyPlayedGames('76561198099490962', 2).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 2,
    "games": [
        {
            "name": "Counter-Strike: Global Offensive",
            "appid": 730,
            "playtime": 61040,
            "playtime_recent": 264,
            "url_store": "https://store.steampowered.com/app/730",
            "url_store_header": "https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg",
            "url_app_logo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/d0595ff02f5c79fd19b06f4d6165c3fda2372820.jpg",
            "url_app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg"
        },
        {
            "name": "Call of Duty: World at War",
            "appid": 10090,
            "playtime": 817,
            "playtime_recent": 24,
            "url_store": "https://store.steampowered.com/app/10090",
            "url_store_header": "https://steamcdn-a.akamaihd.net/steam/apps/10090/header.jpg",
            "url_app_logo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/10090/281c6232bf39e96f2592e241dafe02ef54499df5.jpg",
            "url_app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/10090/2bfb85222af4a01842baa5c3a16a080eb27ac6c3.jpg"
        }
    ]
}
```

## GetOwnedGames
<sub>[[to top of page]](#IPlayerServices)</sub>

Retrieve a list of all games the user has ever bought or installed (free-to-play). This list is seemingly not sorted in any way at all. This will likely not match the user's current library, as some may have installed a free-to-play game, never played it, and then uninstalled it. Even then, that free-to-play game will forever be included as an "owned game."

Despite the Web API claiming that free-to-play games are excluded by default, and may be included if specified, this isn't true and free-to-play games will ALWAYS be returned no matter what you try to tell the Web API. Trust me, I tried and `include_played_free_games` does literally nothing. Sadly there is no way to tell if any of the returned games are free-to-play with this API on it's own, so you'll either have to use another API to check, or keep track of all appIDs of free-to-play games. Thanks Volvo...
### Syntax
`getOwnedGames(steamID[, appIDs[, moreInfo]])`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`appIDs`
> Type: `Array`  
> Default: `null`  
>  
> Array of integer appIDs (or just one integer, no array necessary) to specifically retrieve, set to null to get all owned games

`moreInfo`
> Type: `Boolean`  
> Default: `false`  
>  
> Set to true to get more info: name, image urls


### Result

> **Integer `count`**  
> Number of returned games  
>  
> **Array `games`**  
> Array of objects containing information about owned games  
>> **String `name`**  
>> Full name of the game, only returned if `moreInfo` is `true`  
>  
>> **Integer `appid`**  
>> Steam internal app id, always unique  
>  
>> **Integer `playtime`**  
>> Total game playtime in minutes  
>  
>> **Integer `playtime_recent`**  
>> Game playtime in minutes over the last 2 weeks  
>  
>> **String `url_store`**  
>> Basic url to store page, url is not canonical (name is not in url)  
>  
>> **String `url_store_header`**  
>> Basic url to header image for Steam store page, url stays the same but the resulting image can change frequently, only returned if `moreInfo` is `true`  
>  
>> **String `url_app_logo`**  
>> Url to app logo, seems to always be 184x69 pixels and never changes, only returned if `moreInfo` is `true`  
>  
>> **String `url_app_icon`**  
>> Url to app icon, seems to always be 32x32 pixels and never changes, only returned if `moreInfo` is `true`  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getOwnedGames('76561198099490962', [730, 264710], true).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 2,
    "games": [
        {
            "name": "Subnautica",
            "appid": 264710,
            "playtime": 224,
            "playtime_recent": 0,
            "url_store": "https://store.steampowered.com/app/264710",
            "url_store_header": "https://steamcdn-a.akamaihd.net/steam/apps/264710/header.jpg",
            "url_app_logo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/d6bfaafed7b41466cc99b70972a944ac7e4d6edf.jpg",
            "url_app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/264710/8a14ceef6e230330a916d7a6324b8c52d464d569.jpg"
        },
        {
            "name": "Counter-Strike: Global Offensive",
            "appid": 730,
            "playtime": 61040,
            "playtime_recent": 264,
            "url_store": "https://store.steampowered.com/app/730",
            "url_store_header": "https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg",
            "url_app_logo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/d0595ff02f5c79fd19b06f4d6165c3fda2372820.jpg",
            "url_app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg"
        }
    ]
}
```

## GetSteamLevel
<sub>[[to top of page]](#IPlayerServices)</sub>

Get the current Steam Level of the user, and absolutely nothing more.
### Syntax
`getSteamLevel(steamID)`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string


### Result

> **Integer `level`**  
> Steam level of the user  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getSteamLevel('76561198099490962').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "level": 71
}
```

## GetBadges
<sub>[[to top of page]](#IPlayerServices)</sub>

Get all badges the user currently has, and some detailed level information.
### Syntax
`getBadges(steamID)`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string


### Result

> **Integer `level`**  
> Steam level of the user  
>  
> **Integer `xp`**  
> Total XP the Steam user has  
>  
> **Integer `level_xp`**  
> The XP requirement for the user's current Steam level  
>  
> **Integer `next_level_xp`**  
> The XP requirement for the next Steam level  
>  
> **Object `badges`**  
> Badges by types  
>> **Object `game`**  
>> Game badges listed by appids  
>>> **Integer `appid`**  
>>> Steam internal app id, always unique  
>>  
>>> **Integer `level`**  
>>> Level of the badge, could be any positive integer, or 0 if only the foil badge was unlocked  
>>  
>>> **Integer `earned`**  
>>> Time the badge was initially level 1, in seconds since the epoch, could be 0 if only the foil badge was unlocked  
>>  
>>> **Integer `xp`**  
>>> Amount of XP the badge is worth, could be 0 if only the foil badge was unlocked  
>>  
>>> **Integer `scarcity`**  
>>> The total number of Steam users with a badge level equal to or higher than this badge level, could be 0 if only the foil badge was unlocked  
>>  
>>> **Object `foil`**  
>>> The foil badge information, could be 0 if the user has not unlocked the foil version. Contains the `level`, `earned`, `xp` and `scarcity` properties  
>>  
>  
>> **Object `event`**  
>> Limited time event badges, listed by event tag names. Other than the new `name` property, the badges are identical in structure to game badges  
>>> **String `name`**  
>>> Full name of the badge  
>>  
>  
>> **Object `special`**  
>> Steam specific badges, each with a very unique way of earning/ leveling, listed by tag names. Identical to event badges, but they have no `appid` or `foil` property  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getBadges('76561198099490962').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "level": 71,
    "xp": 29042,
    "level_xp": 28800,
    "next_level_xp": 29600,
    "badges": {
        "game": {
            "730": {
                "appid": 730,
                "level": 5,
                "earned": 1466352436,
                "xp": 500,
                "scarcity": 2794555,
                "foil": 0
            },
            "506670": {
                "appid": 506670,
                "level": 5,
                "earned": 1495724426,
                "xp": 500,
                "scarcity": 23664,
                "foil": 0
            }
        },
        "event": {
            "summer-2016": {
                "name": "2016: Summer Sale",
                "appid": 480730,
                "level": 1,
                "earned": 1467080364,
                "xp": 100,
                "scarcity": 990954,
                "foil": 0
            },
            "awards-2017": {
                "name": "2017: Steam Awards",
                "appid": 762800,
                "level": 22,
                "earned": 1517712529,
                "xp": 2200,
                "scarcity": 13291,
                "foil": 0
            }
        },
        "special": {
            "games": {
                "name": "Owned Games",
                "level": 127,
                "earned": 1547050916,
                "xp": 356,
                "scarcity": 4750842
            },
            "years": {
                "name": "Years of Service",
                "level": 5,
                "earned": 1374542223,
                "xp": 250,
                "scarcity": 68071999
            }
        }
    }
}
```

## GetCommunityBadgeProgress
<sub>[[to top of page]](#IPlayerServices)</sub>

Returns the badge progress for specific task-based badges.
### Syntax
`getBadgeProgress(steamID[, badgeID])`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`badgeID`
> Type: `String`  
> Default: `community`  
>  
> Badge ID, could also be the true integer value of the badge ID. Valid values for this are currently `community`, `summer-2012`, `holiday-2012`, `hardware-beta`, `awards-2016`, `awards-2017`, `awards-2018` and `spring-cleaning`.


### Result

> **Object `quests`**  
> Object of quests, listed by quest ids  
>> **String `name`**  
>> Always 'unknown'. This will eventually contain the description of the task once a map is created to connect quest ids to their actual tasks. You can support development of this feature by finding the `quests.json` file inside the `json` directory in the repository code!  
>  
>> **Boolean `completed`**  
>> Whether or not the task has been completed  
>  
>  
> **Integer `count`**  
> Number of quests for this badge  
>  
> **Integer `completed`**  
> Number of completed quests for this badge  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getBadges('76561198099490962', 'community').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "quests": {
        "260": {
            "name": "unknown",
            "completed": false
        },
        "261": {
            "name": "unknown",
            "completed": false
        },
        "262": {
            "name": "unknown",
            "completed": false
        },
        "263": {
            "name": "unknown",
            "completed": false
        }
    },
    "count": 4,
    "completed": 0
}
```

