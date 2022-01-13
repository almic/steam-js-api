const {urls, validateSteamID, request} = require('./util.js')
const {requireKey} = require('./../app.js')
const util = require('util')

const BADGES = require('./../json/badges.json')

function badgeUpdate(original, update) {
    if (!original) {
        return update
    }

    for (prop in update) {
        // If the `original` is "falsey" then we should update the value according to `update`
        // As this is for a specific use, a deep update is not needed
        if (!original[prop]) {
            original[prop] = update[prop]
        }
    }

    return original
}

function getRecentlyPlayedGames(steamID, count, callback) {

    if (typeof count === 'function') {
        callback = count
        count = 0
    }

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetRecentlyPlayedGames/v1', {key: _key, steamid: steamID, count}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                let response = result.data.response
                let data = { count: 0, games: [] }

                if (response.total_count > 0 && Array.isArray(response.games)) {
                    for (index in response.games) {
                        let game = response.games[index]
                        data.count++
                        data.games[index] = {
                            name: game.name,
                            appID: game.appid,
                            playtime: game.playtime_forever,
                            playtime_recent: game.playtime_2weeks,
                            url_store: urls.storePage(game.appid),
                            url_store_header: urls.storeImg(game.appid),
                            url_app_logo: urls.appImages(game.appid, game.img_logo_url),
                            url_app_icon: urls.appImages(game.appid, game.img_icon_url)
                        }
                    }

                    resolve({data})
                } else {
                    resolve({data})
                }
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

// Volvo actually LIES about the parameters for this interface.
// include_played_free_games and appids_filter are totally ignored

// How totally COOL of them B-)
function getOwnedGames(steamID, appIDs, moreInfo, callback) {

    if (typeof appIDs === 'function') {
        callback = appIDs
        appIDs = null
        moreInfo = true
    } else if (typeof appIDs === 'boolean') {
        if (typeof moreInfo === 'function') {
            callback = moreInfo
        }
        moreInfo = appIDs
        appIDs = null
    } else if (typeof moreInfo === 'function') {
        callback = moreInfo
        moreInfo = true
    }

    if (!Array.isArray(appIDs)) {
        // See if it's numeric with isNaN()
        if (!Number.isNaN(appIDs)) {
            appIDs = null
        } else {
            appIDs = [Number.parseInt(appIDs)]
        }
    }

    moreInfo = Boolean(moreInfo)

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        req = { key: _key, steamid: steamID }

        if (moreInfo) { req.include_appinfo = 1 }

        request('IPlayerService/GetOwnedGames/v1', req, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                let response = result.data.response
                let data = { count: 0, games: [] }

                if (response.game_count > 0 && Array.isArray(response.games)) {
                    for (index in response.games) {
                        let game = response.games[index]
                        if (!appIDs || appIDs && appIDs.includes(game.appid)) {
                            data.games[data.count] = {
                                name: game.name || undefined,
                                appID: game.appid,
                                playtime: game.playtime_forever,
                                playtime_recent: game.playtime_2weeks || 0,
                                url_store: urls.storePage(game.appid)
                            }

                            if (moreInfo) {
                                data.games[data.count].url_store_header = urls.storeImg(game.appid)
                                data.games[data.count].url_app_logo = urls.appImages(game.appid, game.img_logo_url)
                                data.games[data.count].url_app_icon = urls.appImages(game.appid, game.img_icon_url)
                            }

                            data.count++
                            if (appIDs && data.count == appIDs.length) break
                        }
                    }

                    resolve({data})
                } else {
                    resolve({data})
                }
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

function getSteamLevel(steamID, callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetSteamLevel/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                resolve({data: {level: result.data.response.player_level}})
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

function getBadges(steamID, callback) {

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetBadges/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                let response = result.data.response
                let data = {
                    level: response.player_level,
                    xp: response.player_xp,
                    level_xp: response.player_xp_needed_current_level,
                    next_level_xp: response.player_xp + response.player_xp_needed_to_level_up,
                    badges: {
                        game: {},
                        event: {},
                        special: {}
                    }
                }

                for (index in response.badges) {
                    let badge = response.badges[index]

                    if (badge.hasOwnProperty('appid')) {
                        if (BADGES.event.hasOwnProperty(badge.appid)) {
                            // Steam event badge
                            let event = BADGES.event[badge.appid]
                            if (badge.border_color) {
                                // Foil version, update incase normal already added
                                data.badges.event[event.tag] = badgeUpdate(data.badges.event[event.tag], {
                                    name: event.name,
                                    appID: badge.appid,
                                    level: 0,
                                    earned: 0,
                                    xp: 0,
                                    scarcity: 0,
                                    foil: {
                                        level: badge.level,
                                        earned: badge.completion_time,
                                        xp: badge.xp,
                                        scarcity: badge.scarcity
                                    }
                                })

                            } else {
                                // Normal version, update incase foil already added
                                data.badges.event[event.tag] = badgeUpdate(data.badges.event[event.tag], {
                                    name: event.name,
                                    appID: badge.appid,
                                    level: badge.level,
                                    earned: badge.completion_time,
                                    xp: badge.xp,
                                    scarcity: badge.scarcity,
                                    foil: 0
                                })
                            }
                        } else {
                            // Game badge
                            if (badge.border_color) {
                                // Foil version, update
                                data.badges.game[badge.appid] = badgeUpdate(data.badges.game[badge.appid], {
                                    appID: badge.appid,
                                    level: 0,
                                    earned: 0,
                                    xp: 0,
                                    scarcity: 0,
                                    foil: {
                                        level: badge.level,
                                        earned: badge.completion_time,
                                        xp: badge.xp,
                                        scarcity: badge.scarcity
                                    }
                                })
                            } else {
                                // Normal version, update
                                data.badges.game[badge.appid] = badgeUpdate(data.badges.game[badge.appid], {
                                    appID: badge.appid,
                                    level: badge.level,
                                    earned: badge.completion_time,
                                    xp: badge.xp,
                                    scarcity: badge.scarcity,
                                    foil: 0
                                })
                            }
                        }
                    } else {
                        // Special Steam badge
                        let special = BADGES.special[badge.badgeid]
                        if (special) {
                            data.badges.special[special.tag] = {
                                name: special.name,
                                level: badge.level,
                                earned: badge.completion_time,
                                xp: badge.xp,
                                scarcity: badge.scarcity
                            }
                        }
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

function getBadgeProgress(steamID, badgeID, callback) {

    let badges = {
        'community': 2,
        'summer-2012': 7,
        'holiday-2012': 8,
        'hardware-beta': 15,
        'awards-2016': 25,
        'awards-2017': 27,
        'awards-2018': 31,
        'spring-cleaning': 28
    }

    if (typeof badgeID === 'function') {
        callback = badgeID
        badgeID = 'community'
    } else if (!badgeID) {
        badgeID = 'community'
    }

    function run(resolve, reject) {
        let _key = requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        if (typeof badgeID === 'string') {
            if (badges.hasOwnProperty(badgeID)) {
                badgeID = badges[badgeID]
            } else {
                let result = {error: 'Requested badge does not correlate to a task-based badge.'}
                if (reject) reject(result)
                else resolve(result)
            }
        } else if (!Object.values(badges).includes(badgeID)){
            let result = {error: 'Requested badge does not correlate to a task-based badge.'}
            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetCommunityBadgeProgress/v1', {key: _key, steamid: steamID, badgeid: badgeID}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                let response = result.data.response

                let data = {
                    quests: {},
                    count: 0,
                    completed: 0
                }

                for (index in response.quests) {
                    let quest = response.quests[index]
                    data.quests[quest.questid] = {
                        // TODO: map these ids to names
                        name: 'unknown',
                        completed: quest.completed
                    }

                    data.count++
                    if (quest.completed) data.completed++
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

lib.getRecentlyPlayedGames = getRecentlyPlayedGames
lib.getOwnedGames          = getOwnedGames
lib.getSteamLevel          = getSteamLevel
lib.getBadges              = getBadges
lib.getBadgeProgress       = getBadgeProgress

module.exports = lib
