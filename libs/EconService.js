const {urls, request} = require('./util.js')
const {requireKey} = require('./../app.js')

// There is a "start_after_tradeid" parameter, but Volvo was stupid and it can only ever remove
// that specific trade from the start of the list. And it REQUIRES the "start_after_time" to work!!!
// So thanks, Volvo.
function getTradeHistory(trades, moreInfo, includeTotal, includeFailed, fromTime, callback) {

    // There's gotta be a better way to do this, but ahh I'm too lazy and this works
    if (typeof trades === 'function') {
        callback = trades
        trades = 10
        moreInfo = false
        includeTotal = false
        includeFailed = false
    } else if (typeof moreInfo === 'function') {
        callback = moreInfo
        moreInfo = false
        includeTotal = false
        includeFailed = false
    } else if (typeof includeTotal === 'function') {
        callback = includeTotal
        includeTotal = false
        includeFailed = false
    } else if (typeof includeFailed === 'function') {
        callback = includeFailed
        includeFailed = false
    } else if (typeof fromTime === 'function') {
        callback = startFrom
        fromTime = 0
    }

    fromTime = Number(fromTime) || 0
    moreInfo = Boolean(moreInfo)
    includeTotal = Boolean(includeTotal)
    includeFailed = Boolean(includeFailed)

    if (typeof trades === 'number') {
        if (trades < 1) {
            trades = 1
        } else if (moreInfo && trades > 100) {
            // Max 100 with descriptions
            trades = 100
        } else if (trades > 500) {
            // Max 500 without descriptions
            trades = 500
        }
    }

    if (fromTime < 0) {
        fromTime = 0
    } else if (fromTime > Math.floor(new Date() / 1000)) {
        // Don't attempt to rationalize whatever number was passed, just ignore it
        fromTime = 0
    }

    function run(resolve, reject) {
        let _key = requireKey()

        req = { key: _key, max_trades: trades }

        if (moreInfo) { req.get_descriptions = 1 }
        if (includeTotal) { req.include_total = 1 }
        if (includeFailed) { req.include_failed = 1 }
        if (fromTime) { req.start_after_time = fromTime }

        request('IEconService/GetTradeHistory/v1', req, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response
                let data = {
                    hasMore: result.more,
                    count: 0
                }

                if (includeTotal && typeof result.total_trades === 'number')
                    data.total = result.total_trades

                data.trades = []

                // Build list of descriptions first, if applicable
                let desc = {}
                if (moreInfo && result.descriptions && result.descriptions.length > 0) {
                    for (index in result.descriptions) {
                        let d = result.descriptions[index]
                        desc[`${d.appid}_${d.classid}_${d.instanceid}`] = {
                            name: d.name,
                            nameColor: d.name_color,
                            type: d.type,
                            marketName: d.market_name,
                            marketHash: d.market_hash_name,
                            marketUrl: urls.econUrl(d.appid, d.market_hash_name),
                            tradable: d.tradable,
                            marketable: d.marketable,
                            commodity: d.commodity,
                            currency: d.currency,
                            tradeRestriction: d.market_tradable_restriction,
                            icon: urls.econImg(d.icon_url_large || d.icon_url, '')
                        }
                    }
                }

                if (result.trades && result.trades.length > 0) {
                    for (index in result.trades) {
                        let t = result.trades[index]
                        data.trades[data.count] = {
                            id: t.tradeid,
                            status: t.status,
                            other: t.steamid_other,
                            created: t.time_init,
                            received: [],
                            given: []
                        }

                        // Build received and given sorted list
                        let r = []
                        let g = []
                        if (t.assets_received && t.assets_received.length > 0) {
                            for (a in t.assets_received) {
                                let it = t.assets_received[a]
                                r[a] = {
                                    amount: Number(it.amount),
                                    appID: it.appid,
                                    class: it.classid,
                                    instance: it.instanceid,
                                    assetID: it.assetid,
                                    newAssetID: it.new_assetid,
                                }
                                // Add details
                                if (moreInfo) {
                                    r[a].details = desc[`${it.appid}_${it.classid}_${it.instanceid}`] || {}
                                }
                            }
                            // Sort array by appID, class
                            r.sort((a,b)=>(a.appID>b.appID)?1:(b.appID>a.appID)?-1:(a.class>b.class)?1:(b.class>a.class)?-1:0)
                        }

                        if (t.assets_given && t.assets_given.length > 0) {
                            for (b in t.assets_given) {
                                let it = t.assets_given[b]
                                g[b] = {
                                    amount: Number(it.amount),
                                    appID: it.appid,
                                    class: it.classid,
                                    instance: it.instanceid,
                                    assetID: it.assetid,
                                    newAssetID: it.new_assetid,
                                }
                                // Add details
                                if (moreInfo) {
                                    g[b].details = desc[`${it.appid}_${it.classid}_${it.instanceid}`] || {}
                                }
                            }
                            // Sort array by appID, class
                            g.sort((a,b)=>(a.appID>b.appID)?1:(b.appID>a.appID)?-1:(a.class>b.class)?1:(b.class>a.class)?-1:0)
                        }

                        data.trades[data.count].received = r
                        data.trades[data.count].given = g

                        data.count++
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

// Due to dumb Volvo, it doesn't seem that any other interfaces work. Trust me, I tried.
// It's impossible to get specific trade offers using the web api, somehow they broke it.
// Sorry but the best way to work around this is to track trades yourself and save them to a DB
// You can also call this with 500 trades at a time, no descriptions, until you find the trade,
// and if you need descriptions then make another call with the same fromTime as the trade time.

const lib = {}

lib.getTradeHistory = getTradeHistory

module.exports = lib
