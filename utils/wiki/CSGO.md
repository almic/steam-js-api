# CSGO

A collection of Counter-Strike: Global Offensive related interfaces and functions. These functions all lie in the `CSGO` object of the module, so double-check the examples before trying to use these! Some functions that have an `appID` parameter have shortcuts in the `CSGO` object. For example:

```javascript
// instead of:
api.getStats('76561198099490962', 730)

// you can just do:
api.CSGO.getStats('76561198099490962')
```

And to make things even simpler, you may be able to do `const api = require('steam-js-api').CSGO` if you only need these CSGO functions.

### Functions Available
Use these like you normally would, but don't pass the `appID` parameter.
#### ISteamUserStats
* [getGlobalAchievements(callback)](ISteamUserStats#GetGlobalAchievementPercentagesForApp)
* [getCurrentPlayers(callback)](ISteamUserStats#GetNumberOfCurrentPlayers)
* [getAchievements(steamID, callback)](ISteamUserStats#GetPlayerAchievements)
* [getGameSchema(callback)](ISteamUserStats#GetSchemaForGame)
* [getStats(steamID, callback)](ISteamUserStats#GetUserStatsForGame)
#### ISteamEconomy
* [getItemInfo(callback)](ISteamEconomy#GetAssetClassInfo)
* [getGameItemPrices(callback)](ISteamEconomy#GetAssetPrices)

<br />

| Method | Description |
| :--- | :--- |
| [GetGameMapsPlaytime](#GetGameMapsPlaytime) | Grab relative playtime percentages for maps. |
| [GetGameServersStatus](#GetGameServersStatus) | Current status of various CSGO systems and servers. |

<br />

## GetGameMapsPlaytime
<sub>[[to top of page]](#CSGO)</sub>

Grab relative playtime percentages for maps. Right now this only shows the last bit of data from the most recent operation, but I suspect Valve will soon add all maps to this API. By soon, I mean *Valve-time* soon.

I suggest you pay careful attention to the result of this call, and plan for the object structure to change without notice. The raw data is added only as a fallback should Valve make big changes to this API, and you should build any implementation to support the raw fallback data should the custom object fail to build. As a precaution, this function will log a message to the console if it ever fails due to this, however the raw data should always be returned regardless.
### Syntax
`CSGO.getMapPlaytime([interval[, gameMode[, mapGroup]]])`
### Parameters

`interval`
> Type: `String`  
> Default: `day`  
>  
> The interval to return data for, can be `day`, `week`, or `month`

`gameMode`
> Type: `String`  
> Default: `competitive`  
>  
> Which specific game mode should the data be from, can be `competitive` or `casual`

`mapGroup`
> Type: `String`  
> Default: `operation`  
>  
> The specific map group to return. At the moment this can ***only*** be `operation`. If you plan on using this function to track data, I suggest you plan around this default changing or no longer working, as Valve will likely be adding more options to this in the future.


### Result

> **Integer `start`**  
> The time the data started aggregating, in seconds since the epoch  
>
> **Object `maps`**  
> All maps by internal map name, i.e. `de_dust2`, with the values being their relative playtime percentage. **NOTE:** This may stop working without notice, and you should fallback to the below `raw` data in case this object fails to populate.  
>
> **Array `raw`**  
> Raw data from the API. The format is a defined list of "key headers" and a list of "rows", which this object mimics.  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.CSGO.getMapPlaytime('week', 'casual', 'operation').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "start": 1509926400,
    "maps": {
        "cs_agency": 0.38292873923257637,
        "cs_insertion": 0.19107282693813626,
        "de_blackgold": 0.04463586530931871,
        "de_austria": 0.20438527799530148,
        "de_lite": 0.028191072826938134,
        "de_shipped": 0.10415035238841033,
        "de_thrill": 0.04463586530931871
    },
    "raw": [
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "cs_agency",
            "RelativePercentage": 38.29287392325764
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "cs_insertion",
            "RelativePercentage": 19.107282693813627
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "de_blackgold",
            "RelativePercentage": 4.463586530931871
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "de_austria",
            "RelativePercentage": 20.43852779953015
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "de_lite",
            "RelativePercentage": 2.8191072826938135
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "de_shipped",
            "RelativePercentage": 10.415035238841034
        },
        {
            "IntervalStartTimeStamp": 1509926400,
            "MapName": "de_thrill",
            "RelativePercentage": 4.463586530931871
        }
    ]
}
```

## GetGameServersStatus
<sub>[[to top of page]](#CSGO)</sub>

Current status of various CSGO systems and servers. This is cached internally, so this only updates every minute or so. You should wait at least one minute between calls, and check every couple seconds until the `timestamp` changes.
### Syntax
`CSGO.getServerStatus()`
### Parameters


### Result

> **Integer `version`**  
> Internal game version number, looks more like a build number  
>
> **Integer `timestamp`**  
> Time the data was updated, in seconds since the epoch  
>
> **String `time`**  
> String representation of the `timestamp`  
>
> **String `logon`**  
> Status of the logon service. Could potentially be `online`, `delayed` or `offline`.  
>
> **String `inventory`**  
> Status of the community inventory service. Could potentially be `online`, `delayed` or `offline`.  
>
> **Object `perfectWorld`**  
> Perfect World service information  
>> **String `logon`**  
>> Status of the logon service. Could potentially be `online`, `delayed` or `offline`.  
>
>> **String `logonLatency`**  
>> Speed of the logon service. The only known value is `normal`.  
>
>> **String `purchase`**  
>> Likely the status of in-game purchases, but that is just a theory... A GAME THEORY- I'm sorry.  
>
>> **String `purchaseLatency`**  
>> Speed of in-game purchases. The only known value is `normal`.  
>
> **Object `matchmaking`**  
> Matchmaking information  
>> **String `status`**  
>> Status of matchmaking. The only known value is `normal`.  
>
>> **Integer `players`**  
>> Number of currently online players with CSGO open  
>
>> **Integer `servers`**  
>> Number of online servers, I believe this includes community hosted servers, correct me if I'm wrong though!  
>
>> **Integer `searching`**  
>> Players currently searching for a game, I believe this only includes competitive lobbies, correct me if I'm wrong though!  
>
>> **Integer `searchTime`**  
>> Average wait-time to find a game. I do not know how this is actually calculated, tell me if you know!  
>
> **Object `servers`**  
> Server/ Datacenter information, listed by region name  
>> **String `capacity`**  
>> Server type, can be `full` or `high`  
>
>> **String `load`**  
>> Current server load, can be `idle`, `low`, `medium` or `high`  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.CSGO.getServerStatus().then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "version": 13674,
    "timestamp": 1548562114,
    "time": "Sat Jan 26 20:08:34 2019",
    "logon": "normal",
    "inventory": "delayed",
    "perfectWorld": {
        "logon": "online",
        "logonLatency": "normal",
        "purchase": "online",
        "purchaseLatency": "normal"
    },
    "matchmaking": {
        "status": "normal",
        "players": 246247,
        "servers": 163438,
        "searching": 7801,
        "searchTime": 130
    },
    "servers": {
        "Peru": {
            "capacity": "high",
            "load": "low"
        },
        "EU West": {
            "capacity": "full",
            "load": "idle"
        },
        "EU East": {
            "capacity": "full",
            "load": "idle"
        },
        "Poland": {
            "capacity": "full",
            "load": "idle"
        },
        "India East": {
            "capacity": "full",
            "load": "low"
        },
        "Hong Kong": {
            "capacity": "full",
            "load": "low"
        },
        "Spain": {
            "capacity": "high",
            "load": "idle"
        },
        "Chile": {
            "capacity": "full",
            "load": "high"
        },
        "US Southwest": {
            "capacity": "high",
            "load": "low"
        },
        "US Southeast": {
            "capacity": "full",
            "load": "low"
        },
        "India": {
            "capacity": "full",
            "load": "low"
        },
        "EU North": {
            "capacity": "full",
            "load": "low"
        },
        "Emirates": {
            "capacity": "high",
            "load": "idle"
        },
        "US Northwest": {
            "capacity": "full",
            "load": "low"
        },
        "South Africa": {
            "capacity": "full",
            "load": "idle"
        },
        "Brazil": {
            "capacity": "full",
            "load": "medium"
        },
        "US Northeast": {
            "capacity": "full",
            "load": "low"
        },
        "US Northcentral": {
            "capacity": "full",
            "load": "low"
        },
        "Japan": {
            "capacity": "full",
            "load": "low"
        },
        "Singapore": {
            "capacity": "full",
            "load": "low"
        },
        "Australia": {
            "capacity": "full",
            "load": "low"
        },
        "China Shanghai": {
            "capacity": "high",
            "load": "low"
        },
        "China Tianjin": {
            "capacity": "high",
            "load": "low"
        },
        "China Guangzhou": {
            "capacity": "high",
            "load": "low"
        }
    }
}
```

