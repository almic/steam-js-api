const api = require ('./../app.js')

const assert = require('assert')
const util = require('util')

const key = require('./../env.json').key
const steamID = '76561198099490962'

async function test(name, func) {
    console.log('\x1b[33mRunning \x1b[36m%s\x1b[0m', name)
    let duration = process.uptime()
    try {
        await func()
        console.log('\x1b[32mTest \x1b[36m%s\x1b[32m passed (' + Math.floor((process.uptime() - duration) * 100) + 'ms)\x1b[0m\n', name)
    } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', `Test ${name} failed with error:\n${e.stack}`)
    }
}

async function run() {
    try {

        await test('Basic Request', async function() {
            let {statusCode, headers, data, error} = await api.request('ISteamUser/ResolveVanityURL/v1', {key, vanityurl: 'almic'})

            assert.strictEqual(statusCode, 200, `Status code ${statusCode}`)
            assert.strictEqual(data.response.steamid, steamID, `Returned Steam ID '${data.response.steamid}' does not match expected '${steamID}'`)
            assert.ok(data.response.success, `Success value not truthy, got ${data.response.success} instead`)
        })


        await test('getRecentlyPlayedGames', async function() {
            api.setKey(key)

            let result = await api.getRecentlyPlayedGames(steamID)

            assert.strictEqual(result.error, undefined, `Error received: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
        })

        await test('getOwnedGames', async function() {
            api.setKey(key)

            let appIDs = [730, 4000, 220]
            let result = await api.getOwnedGames(steamID, appIDs, true)

            assert.strictEqual(result.error, undefined, `Error received: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
            assert.strictEqual(result.data.count, 3, `Expected exactly 3 games, got ${result.data.count} instead`)

            for (index in result.data.games) {
                let game = result.data.games[index]
                if (!appIDs.includes(game.appid)) {
                    throw new assert.AssertionError({message: `Expected app id ${game.appid} to be one of ${appIDs}`, actual: false, expected: true})
                }
                assert.ok(game.name, `Expected name for game ${game.appid}, got ${JSON.stringify(game.name)} instead`)
            }
        })

        await test('getSteamLevel', async function() {
            api.setKey(key)

            let result = await api.getSteamLevel(steamID)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
            assert.ok(result.data.level, `Expected positive level, result was ${result.data.level}`)
        })

        await test('getBadges', async function () {
            api.setKey(key)

            let result = await api.getBadges(steamID)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let player = result.data

            assert.ok(player.level, `Expected positive level, result was ${player.level}`)
            assert.ok(player.badges, `Expected 'truthy' badges object, result was ${player.badges}`)

            let badges = player.badges

            assert.ok(badges.game, `Expected 'truthy' game object, result was ${badges.game}`)
            assert.ok(badges.game[730], `Expected app id '730' to be in game object, result was ${badges.game[730]}`)
            assert.strictEqual(badges.game[730].appid, 730, `Expected app id '730' to be in the '730' object, result was ${badges.game[730].appid}`)

            assert.ok(badges.event, `Expected 'truthy' event object, result was ${badges.event}`)
            assert.ok(badges.event['winter-2018'], `Expected 'winter-2018' to be in event object, result was ${badges.event['winter-2018']}`)
            assert.strictEqual(badges.event['winter-2018'].appid, 991980, `Expected app id '991980' to be in 'winter-2018' object, result was ${badges.event['winter-2018'].appid}`)

            assert.ok(badges.special, `Expected 'truthy' special object, result was ${badges.special}`)
            assert.ok(badges.special.years, `Expected 'years' to be in special object, result was ${badges.special.years}`)
            assert.strictEqual(badges.special.years.earned, 1374542223, `Expected earned time of '1374542223' in years object, result was ${badges.special.years.earned}`)
        })

    } catch (e) {
        console.error(e)
    }
}

run()
