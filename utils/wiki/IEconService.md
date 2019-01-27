# IEconService

Trading specific interface. Be sure to look at [ISteamEconomy](ISteamEconomy) for item specific stuff.

<br />

| Method | Description |
| :--- | :--- |
| [GetTradeHistory](#GetTradeHistory) | Get a list of the most recent trades. |
| [GetTradeStatus](#GetTradeStatus) | Get details on a single trade offer. |

<br />

## GetTradeHistory
<sub>[[to top of page]](#IEconService)</sub>

Get a list of the most recent trades. This only returns trades connected to the account using the API key. Since you have to have a Steam account to get an API key, the trades will only be ones for the account connected.
### Syntax
`getTradeHistory([trades[, moreInfo[, includeTotal[, includeFailed[, fromTime]]]]])`
### Parameters

`trades`
> Type: `Integer`  
> Default: `10`  
>  
> Maximum number of trades to return. Steam limits you to 500 trades at a time, and if `moreInfo` is true, this drops to 100 trades at a time. The library will automatically apply this limit for you if you go over it.

`moreInfo`
> Type: `Boolean`  
> Default: `false`  
>  
> Whether to retrieved more details about each item, specifically everything that [GetAssetClassInfo](ISteamEconomy#GetAssetClassInfo) returns, but without the extra calls

`includeTotal`
> Type: `Boolean`  
> Default: `false`  
>  
> Whether to return the total number of successful trades the account has in the history. If `includeFailed` is true, this will be the total of all trades created.

`includeFailed`
> Type: `Boolean`  
> Default: `false`  
>  
> Whether to include failed trades in the results

`fromTime`
> Type: `Number`  
> Default: `0`  
>  
> Timestamp (seconds since epoch) to search for trades, any trades made at or before this time are returned. Value of `0` is invalid and will be ignored.


### Result

> **Boolean `hasMore`**  
> If there are more trades available after the last trade returned in this call  
>
> **Integer `count`**  
> Number of trade objects returned, could be smaller than the amount requested if all trades matching the criteria have been returned  
>
> **Integer `total`**  
> Total number of trades associated with the account. Only returned if `includeTotal` is true.  
>
> **Array `trades`**  
> Array of trade objects  
>> **String `id`**  
>> The unique trade ID for this trade, is guaranteed to be unique  
>
>> **Integer `status`**  
>> The status of this trade  
>
>> **String `other`**  
>> The Steam ID of the other account in the trade  
>
>> **Integer `created`**  
>> Time the trade was created, in seconds since the epoch  
>
>> **Array `received`**  
>> Array of item objects being received in the trade  
>>> **Integer `amount`**  
>>> Number of these items being received, will only be more than 1 if the item type is a currency (like gems)  
>>
>>> **Integer `appID`**  
>>> Steam internal app ID, can also be a string  
>>
>>> **String `class`**  
>>> Unique class ID for the item, often enough to uniquely identify an item  
>>
>>> **String `instance`**  
>>> Unique instance ID for the item, truly identifies an item when combined with the class ID  
>>
>>> **String `assetID`**  
>>> Steam internal item ID, used to identify items during a trade, and is renewed every time the item changes inventories  
>>
>>> **String `newAssetID`**  
>>> The new asset ID of the item after trading, can be used to add this specific item to future trades  
>>
>>> **Object `details`**  
>>> Additional details for the item, only returned if `moreInfo` is true  
>>>> **String `name`**  
>>>> Short name of the item  
>>>
>>>> **String `nameColor`**  
>>>> Hexadecimal color that the name should be shown as  
>>>
>>>> **String `type`**  
>>>> Specific type of the item. Can be used for categorizing items.  
>>>
>>>> **String `marketName`**  
>>>> Name shown in the market, exact search name  
>>>
>>>> **String `marketHash`**  
>>>> URL form of the market name  
>>>
>>>> **String `marketUrl`**  
>>>> Full URL to the market page for this kind of item  
>>>
>>>> **Boolean `tradable`**  
>>>> Whether this kind of item is tradable  
>>>
>>>> **Boolean `marketable`**  
>>>> Whether this kind of item is marketable  
>>>
>>>> **Boolean `commodity`**  
>>>> Whether this kind of item is a commodity, meaning all items are technically identical  
>>>
>>>> **Integer `tradeRestriction`**  
>>>> Number of days this item will not be tradable after buying from the market or receiving in a trade  
>>>
>>>> **String `icon`**  
>>>> URL to an icon for this item. A size can be appended to the end like `200x200` to get a specific size image, where the smallest dimensions will match.  
>
>> **Array `given`**  
>> Array of item objects being given in the trade, structurally identical to `received` array above  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getTradeHistory(1, true).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "hasMore": true,
    "count": 1,
    "total": 397,
    "trades": [
        {
            "id": "2167811088932369944",
            "status": 3,
            "other": "76561198190833690",
            "created": 1537325181,
            "received": [],
            "given": [
                {
                    "amount": 1,
                    "appID": 730,
                    "class": "3016071886",
                    "instance": "236997301",
                    "assetID": "14850090609",
                    "newAssetID": "14857676921",
                    "details": {
                        "name": "London 2018 Dust II Souvenir Package",
                        "nameColor": "D2D2D2",
                        "type": "Base Grade Container",
                        "marketName": "London 2018 Dust II Souvenir Package",
                        "marketHash": "London 2018 Dust II Souvenir Package",
                        "marketUrl": "https://steamcommunity.com/market/listings/730/London 2018 Dust II Souvenir Package",
                        "tradable": true,
                        "marketable": true,
                        "commodity": false,
                        "currency": false,
                        "tradeRestriction": 7,
                        "icon": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsX1J6IQtZ5Or0czhwwfzFfgJG6eOygZOfxbmlN7qGzzpV7MMj2u3Hod2i3VewqhI5Nzryd4KQIQc5ZQmD-gfswbzum9bi61mnJtm8/"
                    }
                }
            ]
        }
    ]
}
```

## GetTradeStatus
<sub>[[to top of page]](#IEconService)</sub>

Get details on a single trade offer.
### Syntax
`getTradeOffer(tradeID[, moreInfo])`
### Parameters

`tradeID` *required*
> Type: `String`  
>  
> Unique trade offer ID

`moreInfo`
> Type: `Boolean`  
> Default: `false`  
>  
> Whether to return item descriptions


### Result

> **String `id`**  
> The unique trade ID for this trade, is guaranteed to be unique  
>
> **Integer `status`**  
> The status of this trade  
>
> **String `other`**  
> The Steam ID of the other account in the trade  
>
> **Integer `created`**  
> Time the trade was created, in seconds since the epoch  
>
> **Array `received`**  
> Array of item objects being received in the trade  
>> **Integer `amount`**  
>> Number of these items being received, will only be more than 1 if the item type is a currency (like gems)  
>
>> **Integer `appID`**  
>> Steam internal app ID, can also be a string  
>
>> **String `class`**  
>> Unique class ID for the item, often enough to uniquely identify an item  
>
>> **String `instance`**  
>> Unique instance ID for the item, truly identifies an item when combined with the class ID  
>
>> **String `assetID`**  
>> Steam internal item ID, used to identify items during a trade, and is renewed every time the item changes inventories  
>
>> **String `newAssetID`**  
>> The new asset ID of the item after trading, can be used to add this specific item to future trades  
>
>> **Object `details`**  
>> Additional details for the item, only returned if `moreInfo` is true  
>>> **String `name`**  
>>> Short name of the item  
>>
>>> **String `nameColor`**  
>>> Hexadecimal color that the name should be shown as  
>>
>>> **String `type`**  
>>> Specific type of the item. Can be used for categorizing items.  
>>
>>> **String `marketName`**  
>>> Name shown in the market, exact search name  
>>
>>> **String `marketHash`**  
>>> URL form of the market name  
>>
>>> **String `marketUrl`**  
>>> Full URL to the market page for this kind of item  
>>
>>> **Boolean `tradable`**  
>>> Whether this kind of item is tradable  
>>
>>> **Boolean `marketable`**  
>>> Whether this kind of item is marketable  
>>
>>> **Boolean `commodity`**  
>>> Whether this kind of item is a commodity, meaning all items are technically identical  
>>
>>> **Integer `tradeRestriction`**  
>>> Number of days this item will not be tradable after buying from the market or receiving in a trade  
>>
>>> **String `icon`**  
>>> URL to an icon for this item. A size can be appended to the end like `200x200` to get a specific size image, where the smallest dimensions will match.  
>
> **Array `given`**  
> Array of item objects being given in the trade, structurally identical to `received` array above  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getTradeOffer('2167811088932369944').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "id": "2167811088932369944",
    "status": 3,
    "other": "76561198190833690",
    "created": 1537325181,
    "received": [],
    "given": [
        {
            "amount": 1,
            "appID": 730,
            "class": "3016071886",
            "instance": "236997301",
            "assetID": "14850090609",
            "newAssetID": "14857676921"
        }
    ]
}
```

