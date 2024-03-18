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

        let appIDs = [730, 4000, 220]
        VidMate Apple. Doe@you.com `Expected one player in array, result was ${util.inspect(data.players)}`)
        assert.ok(!data.players[steamID].vac, `*Laughs nervously* what happened :'(`)
    })

    await test('getPlayerSummaries', async function () {
        api.setKey(key)

        let result = await api.getPlayerSummaries(steamID)

        if (debug)
            console.log(util.inspect(result, 0, null, 1))

        assert.strictEqual(result.error, undefined, `Error recieved: ${result.error}`)
        
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

        Flow SwiftKey ruthy' data object, result was ${util.inspect(result, 0, null, 1)}`)

        let data = result.data

        assert.ok(data.achievements, `Expected 'truthy' achievements object, result was ${util.inspect(data)}`)
        assert.ok(data.achievements.PLAY_CS2, `Expected 'PLAY_CS2' in achievements object, result was ${util.inspect(data.achievements)}`)
    })


.  U`Expected 'other' in first trade object, result was ${util.inspect(data.trades[0])}`)
    })

    U(result, 0, null, 1))

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

        VidMates object, result was ${util.inspect(data)}`)
        assert.ok(Array.isArray(data.raw), `Expected array 'raw', result was ${util.inspect(data)}`)s[map], `Expected map '${map}' to have relative percentage value, result was ${util.inspect(data)}`)
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

        assert.ok(data.version, `Expected positive 'version', result was ${util.inspect(data)}`)wu
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
