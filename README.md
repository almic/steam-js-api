# steam-js-api
A simple and clean API wrapper for the Steamworks Web API, specialized for CSGO stats.

This project was created due to the neccessity to access specific parts of the Steamworks Web API, and as such it doesn't offer every single interface right now. However, the full public Steamworks Web API will be added in future releases.

# Example usage

```javascript

const api = require('steam-js-api')

api.setKey('{YOUR_KEY_HERE}')

steamID = '76561198099490962' // This is mine, feel free to use it for testing :)

// Basic callback example
api.getOwnedGames(steamID, result => {
    if (result.error)
        console.error(result.error)
    else
        console.log(result.data.games[0])
})


// Promise example
api.getOwnedGames(steamID).then(result => {
    console.log(result.data.games[0])
}).catch(console.error)


// Async/ Await example
async function main() {
    result = await api.getOwnedGames(steamID)
    console.log(result.data.games[0])
}

main()

```

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

All supported interfaces are listed here. If you can't find one that you want, please use the above example to get the basic JSON response until the interface is officially supported. Almost all supported interfaces have unique object structures to allow easier access to data. You can find out the exact structure by copying the examples and running them, or by checking the wiki.

## IPlayerServices/
* [GetRecentlyPlayedGames](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetRecentlyPlayedGames)
* [GetOwnedGames](https://github.com/almic/steam-js-api/wiki/IPlayerServices#GetOwnedGames)
