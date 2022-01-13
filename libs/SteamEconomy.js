const {urls, request} = require('./util.js')
const {requireKey} = require('./../app.js')

function buildItems(appID, items) {
    let data = {
        count: 0,
        items: {}
    }

    for (let i in items) {
        if (i == 'success' || i == 'error') continue
        let item = items[i]
        let info = {
            name: item.name,
            nameColor: item.name_color,
            type: item.type,
            marketName: item.market_name,
            marketHash: item.market_hash_name,
            // TODO: remove this line
            marketUrl: urls.econUrl(appID, item.market_hash_name),
            tradable: Boolean(Number(item.tradable)),
            marketable: Boolean(Number(item.marketable)),
            commodity: Boolean(Number(item.commodity)),
            tradeRestriction: Number(item.market_tradable_restriction),
            icon: urls.econImg(item.icon_url_large || item.icon_url, '')
        }
        if (info.marketable) {
            info.marketUrl = urls.econUrl(appID, item.market_hash_name)
        }
        data.items[`${item.classid}${(item.instanceid) ? '_' + item.instanceid : ''}`] = info
        data.count++
    }

    return data
}

function getItemInfo(appID, items, callback) {

    if (!Array.isArray(items)) {
        items = [items]
    }

    function run(resolve, reject) {
        let _key = requireKey()

        req = { key: _key, appid: appID }

        let c = 0
        for (index in items) {
            let item = items[index]
            if (item.hasOwnProperty('class') && item.hasOwnProperty('instance')) {
                req[`classid${c}`] = item.class
                req[`instanceid${c}`] = item.instance
                c++
            } else if (item.hasOwnProperty('class')) {
                req[`classid${c}`] = item.class
                c++
            }
        }

        req.class_count = c

        request('ISteamEconomy/GetAssetClassInfo/v1', req, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                let response = result.data.result
                let data = {}

                if (items.length == 1) {
                    if (response.error) {
                        result.steamError = reponse.error
                        result.error = `Error from Steam, data may still have been returned: ${reponse.error}`

                        if (reject) reject(result)
                        else resolve(result)

                        return
                    }

                    data = buildItems(appID, response).items[`${items[0].class}${(items[0].instance) ? '_' + items[0].instance : ''}`]

                } else {
                    data = buildItems(appID, response)
                }

                if (result.error) {
                    if (data.hasOwnProperty('count') && data.count > 0) {
                        result.error = `Data returned. Error from Steam: ${result.error}`
                        result.data = data
                        resolve(result)
                    } else {
                        result.error = `Error from Steam, data may still have been returned: ${result.error}`

                        if (reject) reject(result)
                        else resolve(result)
                    }
                } else {
                    resolve({data})
                }
            } else {
                result.error = 'Unexpected response. Data may have still been returned.'

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

function getGameItemPrices(appID, currencyFilter, callback) {

    if (typeof currencyFilter === 'function') {
        callback = currencyFilter
        currencyFilter = ''
    } else if (!currencyFilter) {
        currencyFilter = ''
    }

    function run(resolve, reject) {
        let _key = requireKey()

        if (!(typeof currencyFilter === 'string') || !currencyFilter.length === 0 && currencyFilter.length !== 3) {
            error = 'Currency filter is not valid'
            if (reject) reject({error})
            else resolve({error})
        }

        request('ISteamEconomy/GetAssetPrices/v1', {key: _key, appid: appID, currency: currencyFilter}, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                let response = result.data.result
                let data = {
                    count: 0,
                    items: []
                }

                for (index in response.assets) {
                    let a = response.assets[index]

                    data.items[data.count] = {
                        class: a.classid,
                        name: a.name,
                        date: a.date,
                        prices: a.prices
                    }

                    if (a.original_prices) {
                        data.items[data.count].pricesOriginal = a.original_prices
                    }

                    data.count++
                }


                resolve({data})
            } else {
                result.error = 'Unexpected response. Data may have still been returned.'

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

const lib = {}

lib.getItemInfo       = getItemInfo
lib.getGameItemPrices = getGameItemPrices

module.exports = lib
