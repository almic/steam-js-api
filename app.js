const LOCATIONS = require('./json/locations-min.json')
const BADGES = require('./json/badges.json')
const PERSONA = require('./json/persona.json')
const https = require('https')

var urls = {
    appImages: (id, img) => { return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${id}/${img}.jpg` },
    storePage: (id) => { return `https://store.steampowered.com/app/${id}` },
    storeImg: (id) => { return `https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg` }
}
var _key = ''

function setKey(key) { _key = key }

function requireKey() {
    if (_key == '')
        throw new Error('This interface requires a Web API user key. Please set one with `api.setKey()` before calling this.')
}

function validateSteamID(steamID) {
    return /^76561[0-9]{12}$/.test(steamID)
}

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

function doRequest(uri, resolve, reject) {
    https.get(uri, result => {
        const {statusCode} = result
        const contentType = result.headers['content-type']

        let isJson = /^application\/json/.test(contentType)
        let isXml = /^text\/xml/.test(contentType)

        let response = {
            statusCode,
            headers: result.headers
        }
        if (statusCode !== 200) {
            response.error = `Request failed with status code ${statusCode}.`
        } else if (!isJson && !isXml) {
            response.error = `Invalid content type, expected 'application/json' or 'text/xml' but received ${contentType}.`
        }

        result.setEncoding('utf8')

        response.data = ''
        result.on('data', d => { response.data += d })

        result.on('end', _ => {
            try {
                if (!isXml) // Return raw data for XML stuff
                    response.data = JSON.parse(response.data || '{}')
            } catch (e) {
                if (!response.error) response.error = e
            }

            if (response.error && reject) {
                reject(response)
            } else {
                resolve(response)
            }
        })

    }).on('error', error => {
        if (reject) {
            reject({error})
        } else {
            resolve({error})
        }
    })
}

function request(interface, options, callback) {

    let uri = `https://api.steampowered.com/${interface}/?`

    if (typeof options === 'function') {
        callback = options
    } else if (typeof options === 'object') {
        for (var key in options) {
            uri += `${key}=${options[key]}&`
        }
    }

    uri = uri.slice(0,-1)

    if (typeof callback === 'function') {
        doRequest(uri, callback)
    } else {
        return new Promise((resolve, reject) => {
            doRequest(uri, resolve, reject)
        })
    }

}

/* IPlayerService */

function getRecentlyPlayedGames(steamID, count, callback) {

    if (typeof count === 'function') {
        callback = count
        count = 0
    }

    function run(resolve, reject) {

        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetRecentlyPlayedGames/v1', {key: _key, steamid: steamID, count}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response
                let data = { count: 0, games: [] }

                if (result.total_count > 0 && Array.isArray(result.games)) {
                    for (index in result.games) {
                        let game = result.games[index]
                        data.count++
                        data.games[index] = {
                            name: game.name,
                            appid: game.appid,
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


// Volvo actually LIES about the parameters for this interface.
// moreInfo has to be a number `0` or `1`, not a boolean `true` or `false`
// include_played_free_games and appids_filter are totally ignored

// How totally COOL of them B-)
function getOwnedGames(steamID, appIDs, moreInfo, callback) {

    if (typeof appIDs === 'function') {
        callback = appIDs
        appIDs = null
        moreInfo = true
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
        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        req = { key: _key, steamid: steamID }

        if (moreInfo) { req.include_appinfo = 1 }

        request('IPlayerService/GetOwnedGames/v1', req, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response
                let data = { count: 0, games: [] }

                if (result.game_count > 0 && Array.isArray(result.games)) {
                    for (index in result.games) {
                        let game = result.games[index]
                        if (!appIDs || appIDs && appIDs.includes(game.appid)) {
                            data.count++
                            data.games[index] = {
                                name: game.name || undefined,
                                appid: game.appid,
                                playtime: game.playtime_forever,
                                playtime_recent: game.playtime_2weeks || 0,
                                url_store: urls.storePage(game.appid)
                            }

                            if (moreInfo) {
                                data.games[index].url_store_header = urls.storeImg(game.appid)
                                data.games[index].url_app_logo = urls.appImages(game.appid, game.img_logo_url)
                                data.games[index].url_app_icon = urls.appImages(game.appid, game.img_icon_url)
                            }

                            if (appIDs && data.count == appIDs.length) break
                        }
                    }

                    resolve({data})
                } else {
                    resolve({data})
                }
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

function getSteamLevel(steamID, callback) {

    function run(resolve, reject) {
        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetSteamLevel/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                resolve({data: {level: result.data.response.player_level}})
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

function getBadges(steamID, callback) {

    function run(resolve, reject) {
        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('IPlayerService/GetBadges/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response
                let data = {
                    level: result.player_level,
                    xp: result.player_xp,
                    level_xp: result.player_xp_needed_current_level,
                    next_level_xp: result.player_xp + result.player_xp_needed_to_level_up,
                    badges: {
                        game: {},
                        event: {},
                        special: {}
                    }
                }

                for (index in result.badges) {
                    let badge = result.badges[index]

                    if (badge.hasOwnProperty('appid')) {
                        if (BADGES.event.hasOwnProperty(badge.appid)) {
                            // Steam event badge
                            let event = BADGES.event[badge.appid]
                            if (badge.border_color) {
                                // Foil version, update incase normal already added
                                data.badges.event[event.tag] = badgeUpdate(data.badges.event[event.tag], {
                                    name: event.name,
                                    appid: badge.appid,
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
                                    appid: badge.appid,
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
                                    appid: badge.appid,
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
                                    appid: badge.appid,
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
                        data.badges.special[special.tag] = {
                            name: special.name,
                            level: badge.level,
                            earned: badge.completion_time,
                            xp: badge.xp,
                            scarcity: badge.scarcity
                        }
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
        requireKey()

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
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                let data = {
                    quests: {},
                    count: 0,
                    completed: 0
                }

                for (index in result.quests) {
                    let quest = result.quests[index]
                    data.quests[quest.questid] = {
                        name: 'unknown',
                        completed: quest.completed
                    }

                    data.count++
                    if (quest.completed) data.completed++
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

function getFriendList(steamID, sorted, callback) {

    if (typeof sorted === 'function') {
        callback = sorted
        sorted = false
    } else if (!sorted) {
        sorted = false
    } else {
        sorted = true
    }

    function run(resolve, reject) {
        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('ISteamUser/GetFriendList/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('friendslist')){
                result = result.data.friendslist

                let data = {
                    count: 0
                }

                let fns = []

                for (index in result.friends) {
                    let f = result.friends[index]

                    fns[index] = {
                        steamID: f.steamid,
                        since: f.friend_since
                    }

                    data.count++
                }

                data.friends = sorted ? fns.sort((a, b) => (a.since > b.since) ? 1 : ((b.since > a.since) ? -1 : 0)) : fns

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

function getPlayerBans(steamIDs, callback) {

    function run(resolve, reject) {
        requireKey()

        if (!Array.isArray(steamIDs)) {
            steamIDs = [steamIDs]
        }

        let ids = ""

        for (index in steamIDs) {
            let steamID = steamIDs[index]
            if (!validateSteamID(steamID)) {
                let result = {error: `Steam ID "${steamID}" does not appear valid`}

                if (reject) reject(result)
                else resolve(result)
            }
            ids += steamID + ','
        }

        ids = ids.slice(0,-1)

        request('ISteamUser/GetPlayerBans/v1', {key: _key, steamids: ids}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('players')){
                result = result.data

                let data = {
                    count: 0,
                    players: {}
                }

                for (index in result.players) {
                    let p = result.players[index]

                    // TODO: improve 'economy' ban message. A string is returned, and I don't know what possible values are

                    data.players[p.SteamId] = {
                        community: p.CommunityBanned,
                        economy: p.EconomyBan,
                        vac: p.VACBanned,
                        bans: p.NumberOfVACBans + p.NumberOfGameBans,
                        vacBans: p.NumberOfVACBans,
                        gameBans: p.NumberOfGameBans,
                        lastBan: p.DaysSinceLastBan
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

function getPlayerSummaries(steamIDs, callback) {

    function run(resolve, reject) {
        requireKey()

        if (!Array.isArray(steamIDs)) {
            steamIDs = [steamIDs]
        }

        let ids = ""

        for (index in steamIDs) {
            let steamID = steamIDs[index]
            if (!validateSteamID(steamID)) {
                let result = {error: `Steam ID "${steamID}" does not appear valid`}

                if (reject) reject(result)
                else resolve(result)
            }
            ids += steamID + ','
        }

        ids = ids.slice(0,-1)

        request('ISteamUser/GetPlayerSummaries/v2', {key: _key, steamids: ids}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                let data = {
                    count: 0,
                    players: {}
                }

                for (index in result.players) {
                    let p = result.players[index]

                    data.players[p.steamid] = {
                        name: p.personaname,
                        realName: p.realname || false,
                        url: p.profileurl,
                        state: p.personastate,
                        stateString: PERSONA.state[p.personastate],
                        public: (p.communityvisibilitystate === 3 ? true : false),
                        comments: (p.commentpermission === 1 ? true : false),
                        joined: p.timecreated || 0,
                        offline: p.lastlogoff,
                        community: (p.profilestate === 1 ? true : false),
                        group: (p.primaryclanid === "103582791429521408" ? false : p.primaryclanid),
                        inGame: ((p.gameextrainfo || p.gameid) ? true : false),
                        appid: ((p.gameid && Number(p.gameid) < 1200000) ? Number(p.gameid) : 0),
                        appName: (p.gameextrainfo ? p.gameextrainfo : ""),
                        avatar: {
                            small: p.avatar,
                            medium: p.avatarmedium,
                            large: p.avatarfull,
                        },
                        location: {
                            country: (p.loccountrycode ? LOCATIONS[p.loccountrycode].name : false),
                            state: (p.locstatecode ? LOCATIONS[p.loccountrycode].state[p.locstatecode].name : false),
                            city: (p.loccityid ? LOCATIONS[p.loccountrycode].state[p.locstatecode].city[p.loccityid] : false),
                            countryCode: (p.loccountrycode ? p.loccountrycode : false),
                            stateCode: (p.locstatecode ? p.locstatecode : false),
                            cityCode: (p.loccityid ? p.loccityid : false)
                        }
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

function getUserGroups(steamID, callback) {

    function run(resolve, reject) {
        requireKey()

        if (!validateSteamID(steamID)) {
            let result = {error: 'Steam ID does not appear valid'}

            if (reject) reject(result)
            else resolve(result)
        }

        request('ISteamUser/GetUserGroupList/v1', {key: _key, steamid: steamID}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                let data = {
                    groups: []
                }

                for (index in result.groups) {
                    let g = result.groups[index]

                    data.groups[index] = g.gid
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

function resolveName(name, type, callback) {

    let types = {
        'user': 1,
        'group': 2,
        'game': 3
    }

    if (typeof type === 'function') {
        callback = type
        type = 1
    } else if (!type) {
        type = 1
    }

    function run(resolve, reject) {
        requireKey()

        if (typeof type === 'string') {
            if (types.hasOwnProperty(type)) {
                type = types[type]
            } else {
                let result = {error: 'Requested type does not correlate to a possible type.'}
                if (reject) reject(result)
                else resolve(result)
            }
        } else if (!Object.values(types).includes(type)) {
            let result = {error: 'Requested type does not correlate to a possible type.'}
            if (reject) reject(result)
            else resolve(result)
        }

        request('ISteamUser/ResolveVanityURL/v1', {key: _key, vanityurl: name, url_type: type}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                let data = {
                    id: (result.success === 1 ? result.steamid : false)
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

function getGroupInfo(id, type, callback) {

    let types = {
        'gid': 'gid',
        'group': 'groups'
    }

    if (typeof type === 'function') {
        callback = type
        type = 'gid'
    } else if (!type) {
        type = 'gid'
    }

    function run(resolve, reject) {

        if (typeof type === 'string') {
            if (types.hasOwnProperty(type)) {
                type = types[type]
            } else {
                let result = {error: 'Requested type does not correlate to a possible type.'}
                if (reject) reject(result)
                else resolve(result)
            }
        } else if (!Object.values(types).includes(type)) {
            let result = {error: 'Requested type does not correlate to a possible type.'}
            if (reject) reject(result)
            else resolve(result)
        }

        doRequest(`https://steamcommunity.com/${type}/${id}/memberslistxml/?xml=1`, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'string'){
                result = result.data

                let counts = result.match(/<memberCount>([0-9]*?)<\/memberCount>/g) || ['','']

                let data = {
                    gid: (result.match(/<groupID64>([0-9]*?)<\/groupID64>/) || {1:0})[1],
                    name: (result.match(/<groupName><!\[CDATA\[(.*?)\]\]><\/groupName>/) || {1:false})[1],
                    vanityName: (result.match(/<groupURL><!\[CDATA\[(.*?)\]\]><\/groupURL>/) || {1:false})[1],
                    summary: (result.match(/<summary><!\[CDATA\[(.*?)\]\]><\/summary>/) || {1:false})[1],
                    members: Number((counts[0].match(/<memberCount>([0-9]*?)<\/memberCount>/) || {1:0})[1]) || 0,
                    membersReal: Number((counts[1].match(/<memberCount>([0-9]*?)<\/memberCount>/) || {1:0})[1]) || 0,
                    membersOnline: Number((result.match(/<membersOnline>([0-9]*?)<\/membersOnline>/) || {1:0})[1]) || 0,
                    membersGame: Number((result.match(/<membersInGame>([0-9]*?)<\/membersInGame>/) || {1:0})[1]) || 0,
                    membersChat: Number((result.match(/<membersInChat>([0-9]*?)<\/membersInChat>/) || {1:0})[1]) || 0,
                    logo: {
                        small: (result.match(/<avatarIcon><!\[CDATA\[(.*?)\]\]><\/avatarIcon>/) || {1:false})[1],
                        medium: (result.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) || {1:false})[1],
                        large: (result.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || {1:false})[1]
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

const api = {}
api.setKey = setKey
api.request = request

// IPlayerService
api.getRecentlyPlayedGames = getRecentlyPlayedGames
api.getOwnedGames = getOwnedGames
api.getSteamLevel = getSteamLevel
api.getBadges = getBadges
api.getBadgeProgress = getBadgeProgress

// ISteamUser
api.getFriendList = getFriendList
api.getPlayerBans = getPlayerBans
api.getPlayerSummaries = getPlayerSummaries
api.getUserGroups = getUserGroups
api.resolveName = resolveName

// Special
api.getGroupInfo = getGroupInfo

module.exports = api
