// To run these tests yourself, you must set these values. Don't forget to create a `.env` file and put your API key there!
const username = 'almic'
const steamID = '76561198099490962'

// Print results from API calls for debugging
const debug = false

// The response for getGameItemPrices() is so massive it typically floods the entire console, so it
// has it's own debug logging. You must use a very long console window to view it, or have the
// output go to a file!
const debugGameItemPrices = false

const api = require('./../app.js')

const assert = require('assert')
const util = require('util')

require('dotenv').config()
const key = process.env.key

let count = 0
let passed = 0

async function test(name, func) {
    count++
    console.log(`\x1b[33mRunning \x1b[36m${name}\x1b[0m`)
    let duration = process.uptime()
    try {
        await func()
        console.log(` \x1b[32mPassed \x1b[36m${name}\x1b[32m (${Math.floor((process.uptime() - duration) * 1000)}ms)\x1b[0m\n`)
        passed++
    } catch (e) {
        console.error(`   \x1b[31mTest \x1b[36m${name}\x1b[31m failed with error:\x1b[0m`)
        if (e.hasOwnProperty("stack")) {
            console.error(`\x1b[31m${e.stack}\x1b[0m`)
        } else {
            console.error(util.inspect(e, 0, null, 1))
        }
    }
}

async function run() {

    console.log(`\x1b[33mRunning tests on version \x1b[36m${process.version}\x1b[0m`)
    console.log(`\x1b[33mDebug \x1b[36m${debug ? "ON" : "OFF"}\x1b[0m`)
    if (debug && debugGameItemPrices)
        console.log('\x1b[31mgetGameItemPrices() output is \x1b[36mON\x1b[31m, prepare for huge output.')
    console.log()

    await test('Basic Request', async function() {
        let result = await api.request('ISteamUser/ResolveVanityURL/v1', {key, vanityurl: 'almic'})

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error received: ${result.error}`)
        assert.strictEqual(result.statusCode, 200, `Status code ${result.statusCode}`)
        assert.strictEqual(result.data.response.steamid, '76561198099490962', `Returned Steam ID '${result.data.response.steamid}' does not match expected '76561198099490962'`)
        assert.ok(result.data.response.success, `Success value not truthy, got ${result.data.response.success} instead`)
    })

    await test('getRecentlyPlayedGames', async function() {
        api.setKey(key)

        let result = await api.getRecentlyPlayedGames(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error received: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
    })

    await test('getOwnedGames', async function() {
        api.setKey(key)

        let appIDs = [730, 4000, 220]
        let result = await api.getOwnedGames(steamID, appIDs, true)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error received: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
        assert.strictEqual(result.data.count, 3, `Expected exactly 3 games, got ${result.data.count} instead`)

        for (index in result.data.games) {
            let game = result.data.games[index]
            if (!appIDs.includes(game.appID)) {
                throw new assert.AssertionError({message: `Expected app ID ${game.appID} to be one of ${appIDs}`, actual: false, expected: true})
            }
            assert.ok(game.name, `Expected name for game ${game.appID}, got ${JSON.stringify(game.name)} instead`)
        }
    })

    await test('getSteamLevel', async function() {
        api.setKey(key)

        let result = await api.getSteamLevel(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)
        assert.ok(result.data.level, `Expected positive level, result was ${util.inspect(result.data)}`)
    })

    await test('getBadges', async function () {
        api.setKey(key)

        let result = await api.getBadges(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let player = result.data

        assert.ok(player.level, `Expected positive level, result was ${util.inspect(player)}`)
        assert.ok(player.badges, `Expected 'truthy' badges object, result was ${util.inspect(player)}`)

        let badges = player.badges

        assert.ok(badges.game, `Expected 'truthy' game object, result was ${util.inspect(badges)}`)
        assert.ok(badges.game[730], `Expected app ID '730' to be in game object, result was ${util.inspect(badges.game)}`)
        assert.strictEqual(badges.game[730].appID, 730, `Expected app ID '730' to be in the '730' object, result was ${util.inspect(badges.game[730])}`)

        assert.ok(badges.event, `Expected 'truthy' event object, result was ${util.inspect(badges)}`)
        assert.ok(badges.event['winter-2018'], `Expected 'winter-2018' to be in event object, result was ${util.inspect(badges.event)}`)
        assert.strictEqual(badges.event['winter-2018'].appID, 991980, `Expected app ID '991980' to be in 'winter-2018' object, result was ${util.inspect(badges.event['winter-2018'])}`)

        assert.ok(badges.special, `Expected 'truthy' special object, result was ${util.inspect(badges)}`)
        assert.ok(badges.special.years, `Expected 'years' to be in special object, result was ${util.inspect(badges.special)}`)
        assert.strictEqual(badges.special.years.earned, 1374542223, `Expected earned time of '1374542223' in years object, result was ${util.inspect(badges.special.years)}`)
    })

    await test('getBadgeProgress', async function () {
        api.setKey(key)

        let result = await api.getBadgeProgress(steamID, 'awards-2018')

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

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

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.count, `Expected positive friend count, result was ${util.inspect(data)}`)
        assert.ok(data.friends, `Expected 'truthy' friends array, result was ${util.inspect(data)}`)
        assert.ok(data.friends[0], `Expected first friend in array, result was ${util.inspect(data.friends)}`)
        assert.ok(data.friends[0].steamID, `Expected steam ID for first friend, result was ${util.inspect(data.friends[0])}`)
    })

    await test('getPlayerBans', async function () {
        api.setKey(key)

        let result = await api.getPlayerBans(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

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

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

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
        assert.strictEqual(typeof player.state, 'number', `Expected value 'state' to be a Number in player object, result was ${util.inspect(player)}`)
        assert.ok(player.stateString, `Expected value 'stateString' in player object, result was ${util.inspect(player)}`)
        assert.ok(player.public, `Expected value 'public' to be true in player object, result was ${util.inspect(player)}`)
        assert.ok(player.comments, `Expected value 'comments' to be true in player object, result was ${util.inspect(player)}`)
        assert.ok(player.joined, `Expected value 'joined' in player object, result was ${util.inspect(player)}`)
        assert.ok(player.offline, `Expected value 'offline' in player object, result was ${util.inspect(player)}`)
        assert.ok(player.community, `Expected value 'community' to be true in player object, result was ${util.inspect(player)}`)
        assert.ok(player.group, `Expected value 'group' to be truthy in player object, result was ${util.inspect(player)}`)
        assert.strictEqual(typeof player.inGame, 'boolean', `Expected value 'inGame' to be a Boolean in player object, result was ${util.inspect(player)}`)
        assert.strictEqual(typeof player.appID, 'number', `Expected value 'appID' to be a Number in player object, result was ${util.inspect(player)}`)
        assert.strictEqual(typeof player.appName, 'string', `Expected value 'appName' to be a String in player object, result was ${util.inspect(player)}`)
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
        assert.ok(player.location.cityCode == 69, `Expected value 'location.cityCode' to be 69 in player object, result was ${util.inspect(player.location)}`)
    })

    await test('getUserGroups', async function () {
        api.setKey(key)

        let result = await api.getUserGroups(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.groups, `Expected 'truthy' groups array, result was ${util.inspect(data)}`)
        assert.ok(data.groups[0], `Expected 'truthy' first group ID, result was ${util.inspect(data)}`)
    })

    await test('resolveName', async function () {
        api.setKey(key)

        let result = await api.resolveName(username)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.id, steamID, `Expected resolved id to match '${steamID}', result was ${util.inspect(data)}`)
    })

    await test('getGroupInfo', async function () {
        let result = await api.getGroupInfo('103582791435315066')

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.gid, `Expected value 'gid' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.name, `Expected value 'name' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.vanityName, `Expected value 'vanityName' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.summary, `Expected value 'summary' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.members, `Expected value 'members' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.membersReal, `Expected value 'membersReal' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.membersOnline, `Expected value 'membersOnline' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.membersGame, `Expected value 'membersGame' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.membersChat, `Expected value 'membersChat' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.logo, `Expected value 'logo' in group object, result was ${util.inspect(data)}`)
        assert.ok(data.logo.small, `Expected value 'logo.small' in group object, result was ${util.inspect(data.logo)}`)
        assert.ok(data.logo.medium, `Expected value 'logo.medium' in group object, result was ${util.inspect(data.logo)}`)
        assert.ok(data.logo.large, `Expected value 'logo.large' in group object, result was ${util.inspect(data.logo)}`)
    })

    await test('getGlobalAchievements', async function () {
        let result = await api.getGlobalAchievements(730)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.achievements, `Expected 'truthy' achievements object, result was ${util.inspect(data)}`)
        assert.ok(data.achievements.KILLING_SPREE, `Expected 'KILLING_SPREE' in achievements object, result was ${util.inspect(data.achievements)}`)
    })

    await test('getCurrentPlayers', async function () {
        let result = await api.getCurrentPlayers(730)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(typeof data.players, 'number', `Expected number of players, result was ${util.inspect(data)}`)
    })

    await test('getAchievements', async function () {
        api.setKey(key)

        let result = await api.getAchievements(steamID, 264710)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(typeof data.count, 'number', `Expected 'count' to be a number in data, result was ${util.inspect(data)}`)
        assert.strictEqual(typeof data.name, 'string', `Expected 'name' to be a string in data, result was ${util.inspect(data)}`)
        assert.ok(data.achievements, `Expected 'truthy' achievements object, result was ${util.inspect(data)}`)
        assert.ok(data.achievements.BuildSeamoth, `Expected 'BuildSeamoth' to be in achievements object, result was ${util.inspect(data.achievements)}`)
        assert.ok(data.achievements.BuildSeamoth.unlocked, `Expected 'BuildSeamoth' to be unlocked in achievements object, result was ${util.inspect(data.achievements.BuildSeamoth)}`)
    })

    await test('getGameSchema', async function () {
        api.setKey(key)

        let result = await api.getGameSchema(264710)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(typeof data.statCount, 'number', `Expected 'statCount' to be a number in data, result was ${util.inspect(data)}`)
        assert.strictEqual(typeof data.achievementCount, 'number', `Expected 'achievementCount' to be a number in data, result was ${util.inspect(data)}`)
        assert.strictEqual(typeof data.name, 'string', `Expected 'name' to be a string in data, result was ${util.inspect(data)}`)
        assert.ok(data.achievements, `Expected 'truthy' achievements object, result was ${util.inspect(data)}`)
        assert.ok(data.achievements.BuildSeamoth, `Expected 'BuildSeamoth' to be in achievements object, result was ${util.inspect(data.achievements)}`)
        assert.ok(data.achievements.BuildSeamoth.displayName, `Expected 'BuildSeamoth' to have a display name in achievements object, result was ${util.inspect(data.achievements.BuildSeamoth)}`)
        assert.ok(data.stats, `Expected 'truthy' stats object, result was ${util.inspect(data)}`)
        assert.ok(data.stats.s1_AllTimeDepth, `Expected 's1_AllTimeDepth' to be in stats object, result was ${util.inspect(data.stats)}`)
        assert.ok(data.stats.s1_AllTimeDepth.displayName, `Expected 's1_AllTimeDepth' to have a display name in stats object, result was ${util.inspect(data.stats.s1_AllTimeDepth)}`)
    })

    await test('getStats', async function () {
        api.setKey(key)

        let result = await api.getStats(steamID, 730)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.name, 'ValveTestApp260', `Thanks Volvo, you finally fixed this (I hope). Name was: ${data.name}`)
        assert.strictEqual(typeof data.count, 'number', `Expected 'count' to be a number in data, result was ${util.inspect(data)}`)
        assert.ok(data.stats, `Expected 'truthy' stats object, result was ${util.inspect(data)}`)
        assert.ok(data.stats.kills, `Expected 'kills' to be in stats object, result was ${util.inspect(data.stats)}`)
        assert.ok(data.stats.bombs, `Expected 'bombs' to be in stats object, result was ${util.inspect(data.stats)}`)
        assert.ok(data.stats.bombs.defused, `Expected 'defused' to be in bombs object, result was ${util.inspect(data.stats.bombs)}`)
    })

    await test('getStats #2', async function () {
        api.setKey(key)

        let result = await api.getStats(steamID, 264710)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.name, 'Subnautica', `Expected name to be 'Subnautica', result was ${data.name}`)
        assert.strictEqual(typeof data.count, 'number', `Expected 'count' to be a number in data, result was ${util.inspect(data)}`)
        assert.ok(data.stats, `Expected 'truthy' stats object, result was ${util.inspect(data)}`)
        assert.ok(data.stats.s1_AllTimeDepth, `Expected 's1_AllTimeDepth' to be in stats object, result was ${util.inspect(data.stats)}`)
        assert.ok(data.stats.s2_HasTank, `Expected 's2_HasTank' to be in stats object, result was ${util.inspect(data.stats)}`)
    })

    await test('getTradeHistory', async function () {
        api.setKey(key)

        let result = await api.getTradeHistory(3, true, true)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.count, 3, `Expected to have 3 trades, result was ${data.count}`)
        assert.ok(data.hasMore, `Expected 'hasMore' to be true, result was ${data.hasMore}`)
        assert.ok(data.trades, `Expected 'truthy' trades array, result was ${util.inspect(data)}`)
        assert.ok(data.trades[0], `Expected first object in trades array, result was ${util.inspect(data.trades)}`)
        assert.ok(data.trades[0].id, `Expected 'id' in first trade object, result was ${util.inspect(data.trades[0])}`)
        assert.ok(data.trades[0].other, `Expected 'other' in first trade object, result was ${util.inspect(data.trades[0])}`)
    })

    await test('getTradeOffer', async function () {
        api.setKey(key)

        let result = await api.getTradeOffer('2167811088932369944', true)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.id, '2167811088932369944', `Expected to have 'tradeID' be '2167811088932369944', result was ${util.inspect(data)}`)
        assert.strictEqual(data.status, 3, `Expected to have 'status' be '3', result was ${util.inspect(data)}`)
        assert.strictEqual(data.other, '76561198190833690', `Expected to have 'other' be '76561198190833690', result was ${util.inspect(data)}`)
        assert.strictEqual(data.created, 1537325181, `Expected to have 'created' be '1537325181', result was ${util.inspect(data)}`)
        assert.strictEqual(data.given[0].class, '3016071886', `Expected to have first given item 'class' be '3016071886', result was ${util.inspect(data)}`)
        assert.strictEqual(data.given[0].details.name, 'London 2018 Dust II Souvenir Package', `Expected to have first given item 'name' be 'London 2018 Dust II Souvenir Package', result was ${util.inspect(data)}`)
    })

    await test('getItemInfo', async function () {
        api.setKey(key)

        let items = [
            {class: '2220112458', instance: '480085569'},
            {class: '2419118169', instance: '188530170'},
            {class: '2735394074'}
        ]

        let result = await api.getItemInfo(730, items)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.strictEqual(data.count, 3, `Expected to have 3 items, result was ${data.count}`)
        assert.ok(data.items, `Expected 'truthy' items object, result was ${util.inspect(data)}`)

        for (index in items) {
            let item = items[index]
            let name = item.class + (item.instance ? '_' + item.instance : '')

            assert.ok(data.items[name], `Expected to find '${name}' in items, result was ${util.inspect(data.items)}`)

            item = data.items[name]

            assert.ok(item.name, `Expected 'name' in item '${name}', result was ${util.inspect(item)}`)
            assert.ok(item.nameColor, `Expected 'nameColor' in item '${name}', result was ${util.inspect(item)}`)
            assert.ok(item.icon, `Expected 'icon' in item '${name}', result was ${util.inspect(item)}`)
        }
    })

    await test('getItemInfo (single)', async function () {
        api.setKey(key)

        let result = await api.getItemInfo(730, [{class: '2316457557'}])

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.name, `Expected 'name' in data, result was ${util.inspect(data)}`)
        assert.ok(data.nameColor, `Expected 'nameColor' in data, result was ${util.inspect(data)}`)
        assert.ok(data.icon, `Expected 'icon' in data, result was ${util.inspect(data)}`)

    })

    await test('getGameItemPrices', async function () {
        api.setKey(key)

        let result = await api.getGameItemPrices(730)

        if (debug && debugGameItemPrices)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.count, `Expected positive item count, result was ${util.inspect(data)}`)
        assert.ok(data.items, `Expected 'truthy' items object, result was ${util.inspect(data)}`)
        assert.ok(data.items[0], `Expected first item in object, result was ${util.inspect(data.items)}`)

        let item = data.items[0]

        assert.ok(item.prices, `Expected 'prices' object in item, result was ${util.inspect(item)}`)
        assert.ok(item.name, `Expected 'name' in item, result was ${util.inspect(item)}`)
        assert.ok(item.class, `Expected 'class' in item, result was ${util.inspect(item)}`)
        assert.ok(item.date, `Expected 'date' in item, result was ${util.inspect(item)}`)
    })

    await test('CSGO.getMapPlaytime', async function () {
        api.setKey(key)

        let result = await api.CSGO.getMapPlaytime('week')

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.start, `Expected positive start time, result was ${util.inspect(data)}`)
        assert.ok(data.maps, `Expected 'truthy' maps object, result was ${util.inspect(data)}`)
        assert.ok(Array.isArray(data.raw), `Expected array 'raw', result was ${util.inspect(data)}`)

        let c = 0
        for (map in data.maps) {
            assert.ok(data.maps[map], `Expected map '${map}' to have relative percentage value, result was ${util.inspect(data)}`)
            c++
        }

        assert.ok(c, `Expected positive number of maps, result was ${util.inspect(data)}`)
        assert.strictEqual(data.raw.length, c, `Expected 'raw' array to have similar length as maps in 'maps' object, result was ${util.inspect(data)}`)
    })

    await test('CSGO.getServerStatus', async function () {
        api.setKey(key)

        let result = await api.CSGO.getServerStatus()

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        assert.ok(result.data, `Expected 'truthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.version, `Expected positive 'version', result was ${util.inspect(data)}`)
        assert.ok(data.timestamp, `Expected positive 'timestamp', result was ${util.inspect(data)}`)
        assert.ok(data.time, `Expected 'time' value, result was ${util.inspect(data)}`)
        assert.ok(data.logon, `Expected 'logon' value, result was ${util.inspect(data)}`)
        assert.ok(data.inventory, `Expected 'inventory' value, result was ${util.inspect(data)}`)
        assert.ok(data.perfectWorld, `Expected 'perfectWorld' object, result was ${util.inspect(data)}`)
        assert.ok(data.perfectWorld.logon, `Expected 'logon' in perfectWorld object, result was ${util.inspect(data.perfectWorld)}`)
        assert.ok(data.matchmaking, `Expected 'matchmaking' object, result was ${util.inspect(data)}`)
        assert.ok(data.matchmaking.status, `Expected 'status' in matchmaking object, result was ${util.inspect(data.matchmaking)}`)
        assert.ok(data.servers, `Expected 'servers' object, result was ${util.inspect(data)}`)
        assert.ok(data.servers['Japan'], `Expected 'Japan' in servers object, result was ${util.inspect(data.servers)}`)
        assert.ok(data.servers['US Northcentral'], `Expected 'US Northcentral' in servers object, result was ${util.inspect(data.servers)}`)
        assert.ok(data.servers['US Northcentral'].capacity, `Expected 'capacity' in US Northcentral object, result was ${util.inspect(data.servers['US Northcentral'])}`)
    })

}

let duration = process.uptime()

run().then(_=> {
    console.log(`\x1b[36mRan \x1b[33m${count}\x1b[36m tests, \x1b[33m${passed}\x1b[36m passed. Run time \x1b[33m${Math.floor((process.uptime() - duration) * 1000)}\x1b[36mms\x1b[0m`)
}).catch(e => {
    console.error(`\x1b[31m${e.stack || util.inspect(e)}\x1b[0m\n`)
    throw new Error('Tests failed, abort.')
}).then(_ => {
    if (debug && debugGameItemPrices)
        console.log('\x1b[36m%s\x1b[0m\n', "Too much output and can't see everything? Try setting `debugGameItemPrices` to false in tests/main.js, or send the output to a file.")
})
