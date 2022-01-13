const {urls, request} = require('./util.js')
const {requireKey} = require('./../app.js')

function getMapPlaytime(interval, gameMode, mapGroup, callback) {

    let intervals = {
        1: 'day',
        2: 'week',
        3: 'month'
    }

    let gameModes = {
        1: 'competitive',
        2: 'casual'
    }

    let mapGroups = {
        1: 'operation'
    }

    if (typeof interval === 'function') {
        callback = interval
        interval = 1
        gameMode = 1
        mapGroup = 1
    } else if (typeof gameMode === 'function') {
        callback = gameMode
        gameMode = 1
        mapGroup = 1
    } else if (typeof mapGroup === 'function') {
        callback = mapGroup
        mapGroup = 1
    }

    if (!interval) interval = 1
    if (!gameMode) gameMode = 1
    if (!mapGroup) mapGroup = 1

    function run(resolve, reject) {
        let _key = requireKey()

        if (!intervals.hasOwnProperty(interval)) {
            if (typeof interval !== 'string' || !Object.values(intervals).includes(interval)) {
                let result = {error: 'Requested interval does not correlate to a possible interval.'}
                if (reject) reject(result)
                else resolve(result)

                return
            }
        } else {
            interval = intervals[interval]
        }

        if (!gameModes.hasOwnProperty(gameMode)) {
            if (typeof gameMode !== 'string' || !Object.values(gameModes).includes(gameMode)) {
                let result = {error: 'Requested gameMode does not correlate to a possible gameMode.'}
                if (reject) reject(result)
                else resolve(result)

                return
            }
        } else {
            gameMode = gameModes[gameMode]
        }

        if (!mapGroups.hasOwnProperty(mapGroup)) {
            if (typeof mapGroup !== 'string' || !Object.values(mapGroups).includes(mapGroup)) {
                let result = {error: 'Requested mapGroup does not correlate to a possible mapGroup.'}
                if (reject) reject(result)
                else resolve(result)

                return
            }
        } else {
            mapGroup = mapGroups[mapGroup]
        }

        request('ICSGOServers_730/GetGameMapsPlaytime/v1', {key: _key, interval, gamemode: gameMode, mapgroup: mapGroup}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                let response = result.data.result
                let data = {start: 0, maps: {}, raw:[]}

                // So here's the deal, the way Valve has created this API is super self-describing.
                // Sounds good, right? Actually this is a major problem... let me explain.
                // Because the format is essentially a 'build-your-own-table' puzzle, I can't rely
                // on the keys to never change, let alone the order of the results. But, I also
                // don't want to sacrifice ease-of-use by requiring callers to do the same nonsense.
                // As such, I'm combining the two. I will create a custom object structure that
                // callers can use, but still include the raw 'key-row' results in case they change
                // stuff around and my structure no longer works. Thanks, Volvo.

                // Build custom object first
                try {
                    data.start = response.Rows[0][0] // use first interval; they're all the same anyway
                    for (index in response.Rows) {
                        let r = response.Rows[index]
                        data.maps[r[1]] = (r[2] / 100) // convert to actual percentage
                    }
                } catch (e) {
                    // This will likely result in crashes on the caller's end if they don't already
                    // have checks in place. The least I can do is to inform them before the whole
                    // app crashes. If they do have checks and fallbacks, good!
                    //throw new Error('API structure has changed. This is critical. Please inform the library developer of \'steam-js-api\'.', { cause: e })
                    console.log('API structure has changed. This is critical. Please inform the library developer. If there are any more errors besides this in the console, the app developer should implement fixes immediately.')
                }

                // Build raw data
                for (a in response.Rows) {
                    let r = response.Rows[a]
                    data.raw[a] = {}
                    for (b in r) {
                        data.raw[a][response.Keys[b]] = r[b]
                    }
                }

                resolve({data})
            } else {
                result.error = 'Unexpected response. Data may have still been returned.'

                if (reject) reject(result)
                else resolve(result)
            }
        })
    }

    if (typeof callback === 'function') {
        run(callback)
    } else {
        return new Promise((resolve, reject) => {
            run(resolve, reject)
        })
    }
}

// Steam only refreshes this about every minute. Therefore, you should probably wait at least a minute
// between calls to this function. If the time hasn't changed yet, then you should call every few
// seconds until it does, then go back to waiting a minute.
function getServerStatus(callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        request('ICSGOServers_730/GetGameServersStatus/v1', {key: _key}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                let response = result.data.result

                let data = {
                    version: response.app.version,
                    timestamp: response.app.timestamp,
                    time: response.app.time,
                    logon: response.services.SessionsLogon,
                    inventory: response.services.SteamCommunity,
                    perfectWorld: {
                        logon: response.perfectworld.logon.availability,
                        logonLatency: response.perfectworld.logon.latency,
                        purchase: response.perfectworld.purchase.availability,
                        purchaseLatency: response.perfectworld.purchase.latency
                    },
                    matchmaking: {
                        status: response.matchmaking.scheduler,
                        players: response.matchmaking.online_players,
                        servers: response.matchmaking.online_servers,
                        searching: response.matchmaking.searching_players,
                        searchTime: response.matchmaking.search_seconds_avg
                    },
                    servers: response.datacenters
                }

                resolve({data})
            } else {
                result.error = 'Unexpected response. Data may have still been returned.'

                if (reject) reject(result)
                else resolve(result)
            }
        })
    }

    if (typeof callback === 'function') {
        run(callback)
    } else {
        return new Promise((resolve, reject) => {
            run(resolve, reject)
        })
    }
}

const lib = {}

// Add primary functions
lib.getMapPlaytime  = getMapPlaytime
lib.getServerStatus = getServerStatus

// Add shortcut functions
const Sus = require('./SteamUserStats.js')
lib.getGlobalAchievements = callback => {return Sus.getGlobalAchievements(730, callback)}
lib.getCurrentPlayers     = callback => {return Sus.getCurrentPlayers(730, callback)}
lib.getAchievements       = (steamID, callback) => {return SUS.getAchievements(steamID, 730, callback)}
lib.getGameSchema         = callback => {return Sus.getGameSchema(730, callback)}
lib.getStats              = (steamID, callback) => {return SUS.getStats(steamID, 730, callback)}

const Se = require('./SteamEconomy.js')
lib.getItemInfo       = (items, callback) => {return Se.getItemInfo(730, items, callback)}
lib.getGameItemPrices = (currencyFilter, callback) => {return Se.getGameItemPrices(730, currencyFilter, callback)}

module.exports = lib
