const https = require('https')

var urls = {
    appImages: (id, img) => { return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${id}/${img}.jpg` },
    storePage: (id) => { return `https://store.steampowered.com/app/${id}` },
    storeImg: (id) => { return `https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg` },
    econImg: (id, size) => { return `https://steamcommunity-a.akamaihd.net/economy/image/${id}/${size}` },
    econUrl: (appid, name) => { return `https://steamcommunity.com/market/listings/${appid}/${name}` }
}

function validateSteamID(steamID) {
    return /^76561[0-9]{12}$/.test(steamID)
}

function doRequest(uri, resolve, reject) {
    https.get(uri, result => {
        const {statusCode} = result
        const contentType = result.headers['content-type']

        let isJson = /^application\/json/.test(contentType)
        let isXml = /^text\/xml/.test(contentType)

        let response = {
            request: {uri},
            statusCode,
            headers: result.headers
        }
        if (statusCode !== 200) {
            response.error = `Request failed with status code ${statusCode}.`

            if (statusCode === 503) {
                response.error += ' Steam may be down temporarily, you should try again later.'
            }
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

const lib = {}

lib.urls            = urls
lib.validateSteamID = validateSteamID
lib.doRequest       = doRequest
lib.request         = request

module.exports = lib
