const api = require ('./../app.js')

const assert = require('assert')
const util = require('util')

const key = require('./../env.json').key
const steamID = '76561198099490962'

let count = 0
let passed = 0

async function test(name, func) {
    count++
    console.log('\x1b[33mRunning \x1b[36m%s\x1b[0m', name)
    let duration = process.uptime()
    try {
        await func()
        console.log(' \x1b[32mPassed \x1b[36m%s\x1b[32m (' + Math.floor((process.uptime() - duration) * 1000) + 'ms)\x1b[0m\n', name)
        passed++
    } catch (e) {
        console.error('   \x1b[31m%s\x1b[0m', `Test ${name} failed with error:\n${e.stack}\n`)
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
            assert.ok(result.data.level, `Expected positive level, result was ${util.inspect(result.data)}`)
        })

        await test('getBadges', async function () {
            api.setKey(key)

            let result = await api.getBadges(steamID)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let player = result.data

            assert.ok(player.level, `Expected positive level, result was ${util.inspect(player)}`)
            assert.ok(player.badges, `Expected 'truthy' badges object, result was ${util.inspect(player)}`)

            let badges = player.badges

            assert.ok(badges.game, `Expected 'truthy' game object, result was ${util.inspect(badges)}`)
            assert.ok(badges.game[730], `Expected app id '730' to be in game object, result was ${util.inspect(badges.game)}`)
            assert.strictEqual(badges.game[730].appid, 730, `Expected app id '730' to be in the '730' object, result was ${util.inspect(badges.game[730])}`)

            assert.ok(badges.event, `Expected 'truthy' event object, result was ${util.inspect(badges)}`)
            assert.ok(badges.event['winter-2018'], `Expected 'winter-2018' to be in event object, result was ${util.inspect(badges.event)}`)
            assert.strictEqual(badges.event['winter-2018'].appid, 991980, `Expected app id '991980' to be in 'winter-2018' object, result was ${util.inspect(badges.event['winter-2018'])}`)

            assert.ok(badges.special, `Expected 'truthy' special object, result was ${util.inspect(badges)}`)
            assert.ok(badges.special.years, `Expected 'years' to be in special object, result was ${util.inspect(badges.special)}`)
            assert.strictEqual(badges.special.years.earned, 1374542223, `Expected earned time of '1374542223' in years object, result was ${util.inspect(badges.special.years)}`)
        })

        await test('getBadgeProgress', async function () {
            api.setKey(key)

            let result = await api.getBadgeProgress(steamID, 'awards-2018')

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let data = result.data

            assert.ok(data.quests, `Expected 'truthy' quest object, result was ${util.inspect(data)}`)
            assert.strictEqual(data.count, 4, `Expected 4 quests, result was ${util.inspect(data)}`)
            assert.strictEqual(data.completed, 0, `Expected 0 completed, result was ${util.inspect(data)}`)
        })

        await test('getFriendList', async function () {
            api.setKey(key)

            let result = await api.getFriendList(steamID, true)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let data = result.data

            assert.ok(data.count, `Expected positive friend count, result was ${util.inspect(data)}`)
            assert.ok(data.friends, `Expected 'truthy' friends array, result was ${util.inspect(data)}`)
            assert.ok(data.friends[0], `Expected first friend in array, result was ${util.inspect(data.friends)}`)
            assert.ok(data.friends[0].steamID, `Expected steam id for first friend, result was ${util.inspect(data.friends[0])}`)
        })

        await test('getPlayerBans', async function () {
            api.setKey(key)

            let result = await api.getPlayerBans(steamID)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let data = result.data

            assert.ok(data.count, `Expected positive player count, result was ${util.inspect(data)}`)
            assert.ok(data.players, `Expected 'truthy' player array, result was ${util.inspect(data)}`)
            assert.ok(data.players[steamID], `Expected one player in array, result was ${util.inspect(data.players)}`)
            assert.ok(!data.players[steamID].vac, `*Laughs nervously* what happened :'(`)
        })

        await test('getPlayerSummaries', async function () {
            api.setKey(key)

            let result = await api.getPlayerSummaries(steamID)

            assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
            assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

            let data = result.data

            assert.ok(data.count, `Expected positive player count, result was ${util.inspect(data)}`)
            assert.ok(data.players, `Expected 'truthy' player array, result was ${util.inspect(data)}`)
            assert.ok(data.players[steamID], `Expected one player in array, result was ${util.inspect(data.players)}`)

            let player = data.players[steamID]

            assert.ok(player.name, `Expected value 'name' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.realName, `Expected value 'realName' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.url, `Expected value 'url' in player object, result was ${util.inspect(player)}`)
            assert.ok(typeof player.state === 'number', `Expected value 'state' to be a Number in player object, result was ${util.inspect(player)}`)
            assert.ok(player.stateString, `Expected value 'stateString' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.public, `Expected value 'public' to be true in player object, result was ${util.inspect(player)}`)
            assert.ok(player.comments, `Expected value 'comments' to be true in player object, result was ${util.inspect(player)}`)
            assert.ok(player.joined, `Expected value 'joined' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.offline, `Expected value 'offline' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.community, `Expected value 'community' to be true in player object, result was ${util.inspect(player)}`)
            assert.ok(player.group, `Expected value 'group' to be truthy in player object, result was ${util.inspect(player)}`)
            assert.ok(typeof player.inGame === 'boolean', `Expected value 'inGame' to be a Boolean in player object, result was ${util.inspect(player)}`)
            assert.ok(typeof player.appid === 'number', `Expected value 'appid' to be a Number in player object, result was ${util.inspect(player)}`)
            assert.ok(typeof player.appName === 'string', `Expected value 'appName' to be a String in player object, result was ${util.inspect(player)}`)
            assert.ok(player.avatar, `Expected value 'avatar' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.avatar.small, `Expected value 'avatar.small' in player object, result was ${util.inspect(player.avatar)}`)
            assert.ok(player.avatar.medium, `Expected value 'avatar.medium' in player object, result was ${util.inspect(player.avatar)}`)
            assert.ok(player.avatar.large, `Expected value 'avatar.large' in player object, result was ${util.inspect(player.avatar)}`)
            assert.ok(player.location, `Expected value 'location' in player object, result was ${util.inspect(player)}`)
            assert.ok(player.location.country !== undefined, `Expected value 'location.country' to be defined in player object, result was ${util.inspect(player.location)}`)
            assert.ok(player.location.state !== undefined, `Expected value 'location.state' to be defined in player object, result was ${util.inspect(player.location)}`)
            assert.ok(player.location.city !== undefined, `Expected value 'location.city' to be defined in player object, result was ${util.inspect(player.location)}`)
            assert.ok(player.location.countryCode !== undefined, `Expected value 'location.countryCode' to be defined in player object, result was ${util.inspect(player.location)}`)
            assert.ok(player.location.stateCode !== undefined, `Expected value 'location.stateCode' to be defined in player object, result was ${util.inspect(player.location)}`)
            assert.ok(player.location.cityCode !== undefined, `Expected value 'location.cityCode' to be defined in player object, result was ${util.inspect(player.location)}`)
        })

    } catch (e) {
        console.error(e)
    }
}

async function main() {

    let duration = process.uptime()

    await run()

    console.log('\x1b[36m%s\x1b[0m', `Ran ${count} tests, ${passed} passed. Run time ${Math.floor((process.uptime() - duration) * 1000)}ms`)
}

main()
