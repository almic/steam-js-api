# ISteamUser

Returns more detailed information about user profiles; summaries, bans, friends. For Steam level, badges, games, and playtime, go to [IPlayerServices](IPlayerServices)

<br />

| Method | Description |
| :--- | :--- |
| [GetFriendList](#GetFriendList) | Gets the friends of the Steam user, if public. |
| [GetPlayerBans](#GetPlayerBans) | Retrieves ban information on the provided Steam IDs. |

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

