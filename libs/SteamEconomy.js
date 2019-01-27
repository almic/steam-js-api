const {urls, request} = require('./util.js')
const {requireKey} = require('./../app.js')

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
                result = {error: result.error}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                result = result.data.result
                let data = {
                    count: 0,
                    items: {}
                }

                if (items.length == 1) {
                    if (result.error) {
                        result = {error: `Error from Steam: ${result.error}`}

                        if (reject) reject(result)
                        else resolve(result)

                        return
                    }

                    for (item in result) {
                        if (item == 'success') continue
                        item = result[item]
                        data = {
                            name: item.name,
                            nameColor: item.name_color,
                            type: item.type,
                            marketName: item.market_name,
                            marketHash: item.market_hash_name,
                            marketUrl: urls.econUrl(item.appid, item.market_hash_name),
                            tradable: Boolean(Number(item.tradable)),
                            marketable: Boolean(Number(item.marketable)),
                            commodity: Boolean(Number(item.commodity)),
                            tradeRestriction: Number(item.market_tradable_restriction),
                            icon: urls.econImg(item.icon_url_large || item.icon_url, '')
                        }
                        break
                    }
                } else {
                    for (item in result) {
                        if (item == 'success' || item == 'error') continue
                        item = result[item]
                        data.items[`${item.classid}${(item.instanceid) ? '_' + item.instanceid : ''}`] = {
                            name: item.name,
                            nameColor: item.name_color,
                            type: item.type,
                            marketName: item.market_name,
                            marketHash: item.market_hash_name,
                            marketUrl: urls.econUrl(item.appid, item.market_hash_name),
                            tradable: Boolean(Number(item.tradable)),
                            marketable: Boolean(Number(item.marketable)),
                            commodity: Boolean(Number(item.commodity)),
                            tradeRestriction: Number(item.market_tradable_restriction),
                            icon: urls.econImg(item.icon_url_large || item.icon_url, '')
                        }
                        data.count++
                    }
                }

                if (result.error) {
                    if (data.count > 0) {
                        resolve({error: `Data returned. Error from Steam: ${result.error}`, data})
                    } else {
                        reject({error: `Error from Steam: ${result.error}`})
                    }
                } else {
                    resolve({data})
                }
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
                result = {error: result.error, data: result}

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'object' && result.data.hasOwnProperty('result')){
                result = result.data.result
                let data = {
                    count: 0,
                    items: []
                }

                for (index in result.assets) {
                    let a = result.assets[index]

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

const lib = {}

lib.getItemInfo       = getItemInfo
lib.getGameItemPrices = getGameItemPrices

module.exports = lib
