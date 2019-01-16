# steam-js-api
A simple and clean API wrapper for the Steamworks Web API, specializing in providing great documentation and straight-forward results. The Steamworks Web API is very inconsistent, this wrapper fixes that by normalizing parameters and responses into predictable formats.

This project was initially created to access specific parts of the Steamworks Web API, and as such it doesn't yet offer every single interface right now. However, the full public Steamworks Web API will be added in future releases.

### Table of Contents

0. **[Getting Started](#getting-started)**
    * **[Download/ Install](#download)**
    * **[Documentation](#documentation-wiki)**
    * **[Usage](#usage)**
1. **[Testing](#testing)**
2. **[Unsupported Interfaces](#unsupported-interfaces)**
3. **[Supported Interfaces](#supported-interfaces)**
    * **[IPlayerService](#iplayerservice)**
    * **[ISteamUser](#isteamuser)**
    * **[ISteamUserStats](#isteamuserstats)**
    * **[Special](#special)**
4. **[FAQ](#faq)**
5. **[License](#license)**

# Getting Started

### Download
This is packaged with [NPM](https://www.npmjs.com/package/steam-js-api), so you can just do `npm install steam-js-api` and get going with it.

```javascript
const api = require('steam-js-api')
```

You can also just download one of the [releases](https://github.com/almic/steam-js-api/releases), and load the file in your javascript like this:

```javascript
const api = require('./steam-js-api/app.js')
```

### Documentation (Wiki)

The official documentation can be found in the [Github Wiki](https://github.com/almic/steam-js-api/wiki). Everything is listed by the Web API interface that it uses, along with a short description of what information you can get from it. Everything is perfectly organized, as all things should be.

### Usage

You can use every function like a Promise or with a callback. If no callback is given, then the function returns a Promise. Anytime a Steam ID is used, the module internally verifies the ID **before** making the request, and **will return an error** if the Steam ID isn't valid.

Almost every function requires you to set the API key. You only have to set this once by calling `setKey()`. Because almost all functions need an API key, the ones that do *not* will explicitly say so in the [wiki](https://github.com/almic/steam-js-api/wiki). **An exception will be thrown** if you don't set an API key before calling a function that requires one.

```javascript
// Basic usage example, with API key
const api = require('steam-js-api')

api.setKey('{YOUR_KEY_HERE}')

steamID = '76561198099490962' // My Steam ID, feel free to use it for testing :)
appID = 730 // We only want to check for one game
moreInfo = true // Provide more info (name, links)

// With a callback
api.getOwnedGames(steamID, appID, moreInfo, (result) => {
    if (result.error)
        console.error(result.error)
    else
        console.log(result.data.games[0])
})


// Alternatively, use a Promise
api.getOwnedGames(steamID, appID, moreInfo).then(result => {
    console.log(result.data.games[0])
}).catch(console.error)

```

This will print out an object that looks a lot like this one:
```json
{
    "name": "Counter-Strike: Global Offensive",
    "appid": 730,
    "playtime": 61041,
    "playtime_recent": 1,
    "url_store": "https://store.steampowered.com/app/730",
    "url_store_header": "https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg",
    "url_app_logo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/d0595ff02f5c79fd19b06f4d6165c3fda2372820.jpg",
    "url_app_icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg"
}
```

# Testing

To keep the library small, I wrote my own testing code that works very well and is pretty simple. Every function is tested in this file: [`tests/main.js`](https://github.com/almic/steam-js-api/blob/master/tests/main.js). The format is pretty straight-forward, and nicely demonstrates every function in real use. However, the [wiki](https://github.com/almic/steam-js-api/wiki) is still the best place to actually learn how to use the functions!

# Unsupported Interfaces

The next section is the full list of all interfaces this wrapper supports. If you can't find one that you want, please follow this example to get the plain JSON object until the interface is officially supported.

```javascript

api.request('ISteamNews/GetNewsForApp/v2', {appid: '730'}, res => {
    if (res.error) {
        console.error(res.error)
        console.error(`Data: ${res.data}`)
        return
    }

    items = res.data.newsitems
})

```

# Supported Interfaces

All supported interfaces are listed here. If you can't find one that you want, please use the above example to get the basic JSON response until the interface is officially supported. Almost all supported interfaces have unique object structures to allow easier access to data. You can find out the exact structure by copying the examples and running them, or by checking the [wiki](https://github.com/almic/steam-js-api/wiki).

## IPlayerService
* [GetBadges](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetBadges)
* [GetCommunityBadgeProgress](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetCommunityBadgeProgress)
* [GetOwnedGames](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetOwnedGames)
* [GetRecentlyPlayedGames](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetRecentlyPlayedGames)
* [GetSteamLevel](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetSteamLevel)

## ISteamUser
* [GetFriendList](https://github.com/almic/steam-js-api/wiki/ISteamUser#GetFriendList)
* [GetPlayerBans](https://github.com/almic/steam-js-api/wiki/ISteamUser#GetPlayerBans)
* [GetPlayerSummaries](https://github.com/almic/steam-js-api/wiki/ISteamUser#GetPlayerSummaries)
* [GetUserGroupList](https://github.com/almic/steam-js-api/wiki/ISteamUser#GetUserGroupList)
* [ResolveVanityURL](https://github.com/almic/steam-js-api/wiki/ISteamUser#ResolveVanityURL)

## ISteamUserStats
* [GetGlobalAchievement...](https://github.com/almic/steam-js-api/wiki/ISteamUserStats#GetGlobalAchievementPercentagesForApp)
* [GetNumberOfCurrentPlayers](https://github.com/almic/steam-js-api/wiki/ISteamUserStats#GetNumberOfCurrentPlayers)
* [GetPlayerAchievements](https://github.com/almic/steam-js-api/wiki/ISteamUserStats#GetPlayerAchievements)
* [GetSchemaForGame](https://github.com/almic/steam-js-api/wiki/ISteamUserStats#GetSchemaForGame)

## Special
These are custom functions that don't use the traditional Steam Web API stuff. As such, they might change in functionality at some point in the future. But I doubt it, Volvo has barely touched the Web API for a number of years now, so this stuff should work as long as everything else in this list does.
* [GetGroupInfo](https://github.com/almic/steam-js-api/wiki/Special#GetGroupInfo)

# FAQ

### Unsupported Interfaces?
> If there's something you can't find, then it likely isn't officially supported yet. But I have the solution! Just follow this simple example and you can still quickly access the interface.
>
> ```javascript
> api.request('ISteamNews/GetNewsForApp/v2', {appid: '730'}, res => {
>     if (res.error) {
>         console.error(res.error)
>         console.error(`Data: ${res.data}`)
>         return
>     }
>
>     items = res.data.newsitems
> })
> ```

### Extra Files/ Scripts?
> For the real attentive people, this repository has some scripts I wrote myself to streamline some development tasks. Obviously, these aren't included in the installed NPM package. Feel free to use them if you want, they come under the exact same license as everything else.

### Can you add X interface?
> Please do not request interfaces to be added. I'm going through the entire list of interfaces and adding them one-by-one. While you wait, check out the above example code for accessing unsupported interfaces.

# License

> MIT License
>
> Copyright (c) 2018 Mick A.
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**tl;dr:** Use this library however you want, just include the `LICENSE` file that comes with the repository when you clone/ download/ install the package.
