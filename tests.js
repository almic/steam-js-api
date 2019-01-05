const api = require ('./app.js')

const assert = require('assert')
const util = require('util')

const key = require('./env.json').key
const steamID = '76561198099490962'

async function test(name, func) {
    console.log(`Running ${name}...`)
    let duration = process.uptime()
    try {
        await func()
        console.log(`Test ${name} passed (${Math.floor((process.uptime() - duration) * 100)}ms)\n`)
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

    } catch (e) {
        console.error(e)
    }
}

run()
