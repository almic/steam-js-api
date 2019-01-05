/*
    This script is used to scrape the possible location combinations returned in player
    summaries. Because Volvo has no dedicated team or person working on the Web API, or that
    person just eats at the snack bar all day, the location data is very terribly useless
    beyond country codes.

    Cities and even states/ provinces are often represented in the API with just numbers, and
    sometimes abominations like these: 'a1', 'c9', or even 'z3'

    Upon completion of this script, it simply prints the entire object to the console, so be
    warned! It's possible that some requests will fail for seemingly no reason, if that ever
    happens, just rerun that particular request by country-code by limiting it with a simple
    == check. Because the world changes all the time, and because Volvo may spontaneously
    decide to update the long abandonded Web API, as they somehow enjoy letting projects rot
    for years and suddenly reviving them with a complete overhaul, this script should be
    run very regularly to ensure that everything is right.
 */


const loginToken = 'steamLoginSecure={{TOKEN}}'
const username = 'almic' // custom vanity url
const steamID = '76561198099490962'

const https = require('https')
const querystring = require('querystring')

// Create Promise Request
function request(uri, options, body) {
    return new Promise((resolve, reject) => {
        if (body) {
            body = querystring.stringify(body)
            options.headers['Content-Length'] = Buffer.byteLength(body)
        }
        var req = https.request(uri, options, result => {
            const {statusCode} = result

            let response = {
                statusCode,
                headers: result.headers
            }
            if (statusCode !== 200) {
                response.error = `Request failed with status code ${statusCode}.`
            }

            result.setEncoding('utf8')

            response.data = ''
            result.on('data', d => { response.data += d })

            result.on('end', _ => {
                if (response.error) {
                    reject(response)
                } else {
                    resolve(response)
                }
            })

        })

        req.on('error', error => {
            reject(error)
        })

        if (body) {
            req.write(body)
        }

        req.end()
    })
}

// Get countries first

async function main(){

    try {
        var result = await request(`https://steamcommunity.com/id/${username}/edit`, {
            headers: {
                Cookie: loginToken
            }
        })

        if (result.error) {
            console.error(result.error)
            return
        }

        var list = /<select name="country"[\s\S]*?<\/option>\s*?(?=<)([\s\S]*?)\s*?<\/select>/i
                   .exec(result.data)[1]
                   .replace(/^\s+|\s+$/gm,'')

        var reg = /<option value="(.*?)".*?>(.*?)<\/option>/g
        var match = reg.exec(list)

        var LOCATIONS = {}

        // Iterate over countries
        while (match != null) {
            let country = match[2]
            let countryCode = match[1]
            console.log(countryCode + ' ' + country)

            LOCATIONS[countryCode] = {
                name: country,
                state: {}
            }

            // Get states for each country

            try {
                result = await request(`https://steamcommunity.com/actions/EditProcess?sId=${steamID}`, {
                    method: 'POST',
                    headers: {
                        Cookie: loginToken,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }}, {
                        json: 1,
                        country: countryCode,
                        type: 'locationUpdate'
                    }
                )

                var rawStates = JSON.parse(result.data).state

                // Add states to a more usable list
                let states = {}
                for (index in rawStates) {
                    s = rawStates[index]
                    c = s.attribs.key
                    n = s.val

                    if (c) {
                        states[c] = n
                    }
                }

                // Check cities
                for (state in states) {
                    console.log(`    ${state}`)
                    LOCATIONS[countryCode].state[state] = {
                        name: states[state],
                        city: {}
                    }
                    try {
                        result = await request(`https://steamcommunity.com/actions/EditProcess?sId=${steamID}`, {
                            method: 'POST',
                            headers: {
                                Cookie: loginToken,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }}, {
                                json: 1,
                                country: countryCode,
                                state: state,
                                type: 'locationUpdate'
                            }
                        )

                        var rawCities = JSON.parse(result.data).city

                        for (index in rawCities) {
                            s = rawCities[index]
                            c = s.attribs.key
                            n = s.val

                            if (c) {
                                LOCATIONS[countryCode].state[state].city[c] = n
                            }
                        }

                    } catch (e) {
                        console.error(e)
                    }
                }

            } catch (e) {
                console.error(e)
            }

            match = reg.exec(list)
        }

        console.log(JSON.stringify(LOCATIONS))

    } catch (e) {
        console.error(e)
    }

}

main()
