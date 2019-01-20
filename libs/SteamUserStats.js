const {validateSteamID, request} = require('./util.js')
const {requireKey} = require('./../app.js')

const STATS = require('./../json/stats-min.json')

// Helps with custom stats structures
function addProp(o, s, v) {
    if (s.length > 2) {
        let k = s.shift()
        if (!(k in o)) {
            o[k] = addProp({}, s, v)
        } else {
            o[k] = addProp(o[k], s, v)
        }
    } else if (s.length == 2) {
        let k = s.shift()
        if (!(k in o)) {
            o[k] = {}
        }
        o[k][s[0]] = v
    } else {
        o[s.shift()] = v
    }
    return o
}

function getGlobalAchievements(appid, callback) {

    function run(resolve, reject) {

        request('ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2', {gameid: appid}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('achievementpercentages')){
                result = result.data.achievementpercentages

                let data = {
                    achievements: {}
                }

                for (index in result.achievements) {
                    let a = result.achievements[index]

                    data.achievements[a.name] = a.percent
                }

                resolve({data})
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}

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

function getCurrentPlayers(appid, callback) {

    function run(resolve, reject) {

        request('ISteamUserStats/GetNumberOfCurrentPlayers/v1', {appid}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                let data = {
                    players: result.player_count
                }

                resolve({data})
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}

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

function getAchievements(steamID, appID, callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('ISteamUserStats/GetPlayerAchievements/v1', {key: _key, steamid: steamID, appid: appID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('playerstats')){
                result = result.data.playerstats

                let data = {
                    name: result.gameName,
                    count: 0,
                    achievements: {}
                }

                for (index in result.achievements) {
                    let a = result.achievements[index]

                    data.achievements[a.apiname] = {
                        unlocked: Boolean(a.achieved),
                        time: a.unlocktime
                    }

                    data.count++
                }

                resolve({data})
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}

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

function getGameSchema(appID, callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        request('ISteamUserStats/GetSchemaForGame/v2', {key: _key, appid: appID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('game')){
                result = result.data.game

                let data = {
                    name: result.gameName,
                    statCount: 0,
                    achievementCount: 0,
                    stats: {},
                    achievements: {}
                }

                result = result.availableGameStats

                for (index in result.stats) {
                    let s = result.stats[index]

                    data.stats[s.name] = {
                        displayName: s.displayName,
                        default: s.defaultvalue
                    }

                    data.statCount++
                }

                for (index in result.achievements) {
                    let a = result.achievements[index]

                    data.achievements[a.name] = {
                        displayName: a.displayName,
                        description: a.description || "",
                        hidden: Boolean(a.hidden),
                        icon: a.icon,
                        iconLocked: a.icongray
                    }

                    data.achievementCount++
                }

                resolve({data})
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}

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

function getStats(steamID, appID, callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('ISteamUserStats/GetUserStatsForGame/v2', {key: _key, steamid: steamID, appid: appID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('playerstats')){
                result = result.data.playerstats

                let data = {
                    name: result.gameName,
                    count: 0,
                    stats: {}
                }

                if (STATS.hasOwnProperty(appID)) {
                    // Custom structure defined
                    for (index in result.stats) {
                        let s = result.stats[index]
                        if (STATS[appID][s.name]) {
                            // Custom, add data
                            data.stats = addProp(data.stats, STATS[appID][s.name].name.split('.'), s.value)
                        } else {
                            // Unspecified, place inside 'unknown' with original name
                            if (!data.stats.unknown) {
                                data.stats.unknown = {}
                            }
                            data.stats.unknown[s.name] = s.value
                        }
                        data.count++
                    }
                } else {
                    // No custom structure defined, use basic structure
                    for (index in result.stats) {
                        let s = result.stats[index]
                        data.stats[s.name] = s.value
                        data.count++
                    }
                }

                resolve({data})
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}

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

lib.getGlobalAchievements = getGlobalAchievements
lib.getCurrentPlayers     = getCurrentPlayers
lib.getAchievements       = getAchievements
lib.getGameSchema         = getGameSchema
lib.getStats              = getStats

module.exports = lib
