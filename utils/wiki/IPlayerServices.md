# IPlayerServices

Specifically playtime, owned games, badges, and Steam level. For player summaries, bans and friend list, go to [ISteamUser](ISteamUser)

<br />

| Method | Description |
| :--- | :--- |
| [GetRecentlyPlayedGames](#GetRecentlyPlayedGames) | Get information about games the user has played within the last 2 weeks. |
| [GetOwnedGames](#GetOwnedGames) | Retrieve a list of all games the user has ever bought or installed (free-to-play). |

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
api.setKet('{{YOUR KEY}}')

getRecentlyPlayedGames('76561198099490962', 2).then(result => {
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
api.setKet('{{YOUR KEY}}')

getOwnedGames('76561198099490962', [730, 264710], true).then(result => {
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

