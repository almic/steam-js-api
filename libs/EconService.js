const {urls, request} = require('./util.js')
const {requireKey} = require('./../app.js')

function buildAssetArray(assets, details) {
    if (!Array.isArray(assets) || assets.length === 0)
        return []

    let l = []
    for (a in assets) {
        let it = assets[a]
        l[a] = {
            amount: Number(it.amount),
            appID: it.appid,
            class: it.classid,
            instance: it.instanceid,
            assetID: it.assetid,
            newAssetID: it.new_assetid,
        }
        // Add details
        if (details) {
            l[a].details = details[`${it.appid}_${it.classid}_${it.instanceid}`] || {}
        }
    }
    // Sort array by appID, class
    l.sort((a,b)=>(a.appID>b.appID)?1:(b.appID>a.appID)?-1:(a.class>b.class)?1:(b.class>a.class)?-1:0)
    return l
}

function buildDescriptions(descriptions) {
    if (!Array.isArray(descriptions) || descriptions.length === 0)
        return {}

    let desc = {}
    for (index in descriptions) {
        let d = descriptions[index]
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
    return desc
}

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

                if (result.trades && result.trades.length > 0) {
                    let data = {
                        hasMore: result.more,
                        count: 0
                    }

                    if (includeTotal && typeof result.total_trades === 'number')
                        data.total = result.total_trades

                    data.trades = []

                    let desc = buildDescriptions(result.descriptions)

                    for (index in result.trades) {
                        let t = result.trades[index]
                        data.trades[data.count] = {
                            id: t.tradeid,
                            status: t.status,
                            other: t.steamid_other,
                            created: t.time_init,
                            received: buildAssetArray(t.assets_received, desc),
                            given: buildAssetArray(t.assets_given, desc)
                        }
                        data.count++
                    }
                    resolve({data})
                    return
                } else {
                    result = {error: 'No trade data returned. Data may have still been returned.', data: result}
                }
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}
            }

            if (reject) reject(result)
            else resolve(result)
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

// Due to dumb Volvo, the API to get individual trade details is not in the official documentation,
// but instead tucked away in another API. Thanks Volvo.
function getTradeOffer(tradeID, moreInfo, callback) {

    if (typeof moreInfo === 'function') {
        callback = moreInfo
        moreInfo = false
    }

    moreInfo = Number(Boolean(moreInfo))

    function run(resolve, reject) {
        let _key = requireKey()

        request('IEconService/GetTradeStatus/v1', {key: _key, tradeid: tradeID, get_descriptions: moreInfo}, result => {
            if (result.error) {
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('response')){
                result = result.data.response

                if (result.trades && result.trades[0]) {
                    let data = {}
                    let desc = buildDescriptions(result.descriptions)

                    let t = result.trades[0]
                    data = {
                        id: t.tradeid,
                        status: t.status,
                        other: t.steamid_other,
                        created: t.time_init,
                        received: buildAssetArray(t.assets_received, desc),
                        given: buildAssetArray(t.assets_given, desc)
                    }

                    resolve({data})
                } else {
                    result = {error: 'No trade data returned. Data may have still been returned.', data: result}
                }
            } else {
                result = {error: 'Unexpected response. Data may have still been returned.', data: result.data}
            }

            if (reject) reject(result)
            else resolve(result)
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

lib.getTradeHistory = getTradeHistory
lib.getTradeOffer   = getTradeOffer

module.exports = lib
