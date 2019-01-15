# ISteamUser

Returns more detailed information about user profiles; summaries, bans, friends. For Steam level, badges, games, and playtime, go to [IPlayerServices](IPlayerServices)

<br />

| Method | Description |
| :--- | :--- |
| [GetFriendList](#GetFriendList) | Gets the friends of the Steam user, if public. |
| [GetPlayerBans](#GetPlayerBans) | Retrieves ban information on the provided Steam IDs. |
| [GetPlayerSummaries](#GetPlayerSummaries) | Get basic community profile information from the Steam IDs. |

<br />

## GetFriendList
<sub>[[to top of page]](#ISteamUser)</sub>

Gets the friends of the Steam user, if public.
### Syntax
`getFriendList(steamID[, sorted])`
### Parameters

`steamID` *required*
> Type: `String`  
>  
> Steam ID of the user, as a string

`sorted`
> Type: `Boolean`  
> Default: `false`  
>  
> Enable sorting by friending time, with the oldest friends at the top of the resulting list


### Result

> **Integer `count`**  
> Number of friends  
>  
> **Array `friends`**  
> Array of friend objects, sorted if the `sorted` paramter is `true`  
>> **String `steamID`**  
>> Steam ID of the friend  
>  
>> **Integer `since`**  
>> Time the friend was added, in seconds since the epoch  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getFriendList('76561198099490962', true).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 4,
    "friends": [
        {
            "steamID": "76561198064527259",
            "since": 1374546543
        },
        {
            "steamID": "76561198073477368",
            "since": 1385304477
        },
        {
            "steamID": "76561198055109162",
            "since": 1415236183
        },
        {
            "steamID": "76561198190833690",
            "since": 1475462732
        }
    ]
}
```

## GetPlayerBans
<sub>[[to top of page]](#ISteamUser)</sub>

Retrieves ban information on the provided Steam IDs. Notice that is PLURAL. You can get information on multiple Steam IDs at once, however Steam may internally limit the max number of Steam IDs you can query at once.
### Syntax
`getPlayerBans(steamIDs)`
### Parameters

`steamIDs` *required*
> Type: `Array`  
>  
> Array of Steam ID strings, or just one, no array necessary


### Result

> **Integer `count`**  
> Number of returned profiles, useful for checking if any Steam IDs were ignored or cropped from the final result  
>  
> **Object `players`**  
> Ban objects listed by Steam ID  
>> **Boolean `community`**  
>> Whether or not the account has a community ban  
>  
>> **String `economy`**  
>> What type of economy ban the account has. These are often temporary. Sadly, I don't know the possible values of this. If you have account restrictions, or know someone who does, please reach out to me so I can finish development on this part.  
>  
>> **Boolean `vac`**  
>> Whether or not the account has a VAC ban. It may be possible for a single account to have multiple VAC bans, but I personally doubt it as VAC normally bans across ALL VAC secure games.  
>  
>> **Integer `bans`**  
>> Total number of bans on the account; VAC + Game bans  
>  
>> **Integer `vacBans`**  
>> Number of VAC bans on the account  
>  
>> **Integer `gameBans`**  
>> Number of Game bans on the account. Game bans are not VAC bans, they are manually given to a player by the developer of the game they got banned on.  
>  
>> **Integer `lastBan`**  
>> Number of days since the last ban was given to the account, a value of `0` indicates the account recieved a ban *today*  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getPlayerBans('76561198099490962').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 1,
    "players": {
        "76561198099490962": {
            "community": false,
            "economy": "none",
            "vac": false,
            "bans": 0,
            "vacBans": 0,
            "gameBans": 0,
            "lastBan": 0
        }
    }
}
```

## GetPlayerSummaries
<sub>[[to top of page]](#ISteamUser)</sub>

Get basic community profile information from the Steam IDs. Notice that is PLURAL. You can get information on multiple Steam IDs at once, however Steam may internally limit the max number of Steam IDs you can query at once.
### Syntax
`getPlayerSummaries(steamIDs)`
### Parameters

`steamIDs` *required*
> Type: `Array`  
>  
> Array of Steam ID strings, or just one, no array necessary


### Result

> **Integer `count`**  
> Number of returned profiles, useful for checking if any Steam IDs were ignored or cropped from the final result  
>  
> **Object `players`**  
> Player objects listed by Steam ID  
>> **String `name`**  
>> Persona name, this is shown in games and on the website  
>  
>> **String `realName`**  
>> The "real name" set by the account, not guaranteed to actually be real. May be set to Boolean `false` if unset, useful for checking if a string is set before printing it  
>  
>> **String `url`**  
>> Community profile URL, may contain the Steam ID or be the custom vanity url set by the account  
>  
>> **Integer `state`**  
>> A value from 0-6; 0 - Offline, 1 - Online, 2 - Busy, 3 - Away, 4 - Snooze, 5 - Looking to Trade, 6 - Looking to Play  
>  
>> **String `stateString`**  
>> Mapped value of `state` to a string, see the `persona.json` file in `json` for values  
>  
>> **Boolean `public`**  
>> Whether or not the profile is visible, if this is false then some interfaces may not work at all, and limited data is available through player summaries  
>  
>> **Boolean `comments`**  
>> Whether or not the comments are set to public, if this is false then you won't be able to comment on the profile, and may also not be able to see comments  
>  
>> **Integer `joined`**  
>> Time the account was created, in seconds since the epoch. This is not available for private accounts, however you can easily use the Steam ID to guess the time the account was created anyway.  
>  
>> **Integer `offline`**  
>> Time the account last went offline, in seconds since the epoch. This does not mean the player is currently offline, or when they *actually* went offline, just the last time their status changed to be offline.  
>  
>> **Boolean `community`**  
>> Whether or not the profile has a community profile set up. You should not allow accounts without a community profile to use your services.  
>  
>> **Integer `group`**  
>> The primary group set by the user, if no group is set then this value is a Boolean `false` to avoid ambiguity  
>  
>> **Boolean `inGame`**  
>> If the user is currently in a game  
>  
>> **Integer `appid`**  
>> If `inGame` is true, then this is the app id of the game being played. If `inGame` is true and this value is 0, then the account is playing a non-Steam game.  
>  
>> **String `appName`**  
>> If `inGame` is true, then this is most likely the name of the game being played. If `appid` is 0, this is the "extra game info" from the non-Steam game, and may not be an accurate representation of the true game name.  
>  
>> **Object `avatar`**  
>> Holds the various urls for the avatar sizes  
>>> **String `small`**  
>>> URL for the 32x32 avatar  
>>  
>>> **String `medium`**  
>>> URL for the 64x64 avatar  
>>  
>>> **String `large`**  
>>> URL for the 184x184 avatar  
>>  
>  
>> **Object `location`**  
>> The public location of the account, should never be used for any real location authentication, as users can change this whenever and however they want  
>>> **String `country`**  
>>> Full English name of the country, is a Boolean `false` if not set by the account  
>>  
>>> **String `state`**  
>>> Full English name of the state/ province/ city-state, is a Boolean `false` if not set by the account  
>>  
>>> **String `city`**  
>>> Full English name of the city, is a Boolean `false` if not set by the account. Keep in mind some country states have only one possible city, and some have no city options at all.  
>>  
>>> **String `countryCode`**  
>>> The country code for the country, should adhere to world standards (i.e. United States code is `US`)  
>>  
>>> **String `stateCode`**  
>>> The state code for the state, for some countries this is the official abbreviation (i.e. Alaska state code is `AK`) but for most this is just a random internal code  
>>  
>>> **Integer `cityCode`**  
>>> The city code for the city, seems to be a completely unique id, otherwise this is not standardized and only for internal use  
>>  
>  
>  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getPlayerSummaries('76561198099490962').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 1,
    "players": {
        "76561198099490962": {
            "name": "Almic",
            "realName": "Mick Ashton",
            "url": "https://steamcommunity.com/id/almic/",
            "state": 1,
            "stateString": "online",
            "public": true,
            "comments": true,
            "joined": 1374542223,
            "offline": 1547510790,
            "community": true,
            "group": "103582791435315066",
            "inGame": true,
            "appid": 730,
            "appName": "Counter-Strike: Global Offensive",
            "avatar": {
                "small": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d9/d92bde555a21e7e5074b5cdb8ed733e088cad1c5.jpg",
                "medium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d9/d92bde555a21e7e5074b5cdb8ed733e088cad1c5_medium.jpg",
                "large": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d9/d92bde555a21e7e5074b5cdb8ed733e088cad1c5_full.jpg"
            },
            "location": {
                "country": "United States",
                "state": "Alaska",
                "city": "Nome",
                "countryCode": "US",
                "stateCode": "AK",
                "cityCode": 69
            }
        }
    }
}
```

