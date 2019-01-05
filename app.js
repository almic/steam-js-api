const LOCATIONS = require('./locations-min.json')
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

function doRequest(uri, resolve, reject) {
    https.get(uri, result => {
        const {statusCode} = result
        const contentType = result.headers['content-type']

        let response = {
            statusCode,
            headers: result.headers
        }
        if (statusCode !== 200) {
            response.error = `Request failed with status code ${statusCode}.`
        } else if (!/^application\/json/.test(contentType)) {
            response.error = `Invalid content type, expected application/json but received ${contentType}.`
        }

        result.setEncoding('utf8')

        response.data = ''
        result.on('data', d => { response.data += d })

        result.on('end', _ => {
            try {
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


const api = {}
api.setKey = setKey
api.request = request

api.getRecentlyPlayedGames = getRecentlyPlayedGames
api.getOwnedGames = getOwnedGames

module.exports = api
