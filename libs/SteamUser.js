const {validateSteamID, request} = require('./util.js')
const {requireKey} = require('./../app.js')

const PERSONA = require('./../json/persona.json')
const LOCATIONS = require('./../json/locations-min.json')

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
        let _key = requireKey()

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
        let _key = requireKey()

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
        let _key = requireKey()

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
                        appID: ((p.gameid && Number(p.gameid) < 1200000) ? Number(p.gameid) : 0),
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
        let _key = requireKey()

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
        let _key = requireKey()

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

const lib = {}

lib.getFriendList      = getFriendList
lib.getPlayerBans      = getPlayerBans
lib.getPlayerSummaries = getPlayerSummaries
lib.getUserGroups      = getUserGroups
lib.resolveName        = resolveName

module.exports = lib
