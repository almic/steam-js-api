# ISteamEconomy

Steam economy item related stuff. Be sure to look at [IEconService](IEconService) for trading stuff.

<br />

| Method | Description |
| :--- | :--- |
| [GetAssetClassInfo](#GetAssetClassInfo) | Access item specific details by `class` and `instance` IDs. |
| [GetAssetPrices](#GetAssetPrices) | Find prices of purchasable in-game items. |

<br />

## GetAssetClassInfo
<sub>[[to top of page]](#ISteamEconomy)</sub>

Access item specific details by `class` and `instance` IDs. You can pass any objects that have a `class` ID, and you can use `instance` IDs for more specific details on a certain item. Items returned from [GetTradeHistory](ISteamEconomy#GetTradeHistory) can be passed directly to this function!

The Steam Web API goes through each item one at a time, and stops giving results as soon as an item can't be located. I.e.: You pass 10 items, and all items except the 4th item are valid, however because the 4th failed, Steam returns immediately and only 3 items are in the response.

*NOTE:* If you only pass a single item, the result will be that item object itself, rather than being an object with a `count` and `items` object.
### Syntax
`getItemInfo(appID, items)`
### Parameters

`appID` *required*
> Type: `Integer`  
>  
> Steam internal app ID, can also be a string

`items` *required*
> Type: `Object/ Array of Objects`  
>  
> An object or array of objects defining items. They must include a `class` ID, and may optionally include an `instance` ID to get more specific details about the item.


### Result

> **Integer `count`**  
> Total number of items returned. If this is less than the number passed, then one of the items failed. **Only included if more than one item was requested.**  
>
> **Object `items`**  
> Item objects listed by their `class` ID. If an `instance` ID was passed for a certain item, then that name is `{{class}}_{{instance}}`. **Only included if more than one item was requested.**  
>> **String `name`**  
>> Short name of the item  
>
>> **String `nameColor`**  
>> Hexadecimal color that the name should be shown as  
>
>> **String `type`**  
>> Specific type of the item. Can be used for categorizing items.  
>
>> **String `marketName`**  
>> Name shown in the market, exact search name  
>
>> **String `marketHash`**  
>> URL form of the market name  
>
>> **String `marketUrl`**  
>> Full URL to the market page for this kind of item  
>
>> **Boolean `tradable`**  
>> Whether this kind of item is tradable  
>
>> **Boolean `marketable`**  
>> Whether this kind of item is marketable  
>
>> **Boolean `commodity`**  
>> Whether this kind of item is a commodity, meaning all items are technically identical  
>
>> **Integer `tradeRestriction`**  
>> Number of days this item will not be tradable after buying from the market or receiving in a trade  
>
>> **String `icon`**  
>> URL to an icon for this item. A size can be appended to the end like `200x200` to get a specific size image, where the smallest dimensions will match.  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getItemInfo(730, {class: '2735394074'}).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "name": "AUG | Stymphalian",
    "nameColor": "D2D2D2",
    "type": "Classified Rifle",
    "marketName": "AUG | Stymphalian (Factory New)",
    "marketHash": "AUG | Stymphalian (Factory New)",
    "marketUrl": "https://steamcommunity.com/market/listings/undefined/AUG | Stymphalian (Factory New)",
    "tradable": true,
    "marketable": true,
    "commodity": false,
    "tradeRestriction": 7,
    "icon": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot6-iFABz7PLddgJR-MW7hIiKm_71PYTTn3lV-_p9g-7J4bP5iUazrl1sa23zd4KQJlQ_YlCB-la8xuu8h5S5vMzJwXpi7HUl4H2LnRLkhxhNcKUx0ob1nNaW/"
}
```

## GetAssetPrices
<sub>[[to top of page]](#ISteamEconomy)</sub>

Find prices of purchasable in-game items. Only works for economy appIDs, calling this with games that have no in-game purchasable items will certainly result in errors.
### Syntax
`getGameItemPrices(appID[, currencyFilter])`
### Parameters

`appID` *required*
> Type: `Integer`  
>  
> Steam internal app ID, can also be a string

`currencyFilter`
> Type: `String`  
> Default: `false`  
>  
> The 3-letter currency code to return, for example 'USD' or 'JPY'. Boolean `false` or empty string returns all prices.


### Result

> **Integer `count`**  
> Number of items returned  
>
> **Array `items`**  
> Array of item objects  
>> **String `class`**  
>> Unique class ID for the item, often enough to uniquely identify an item  
>
>> **String `name`**  
>> Not actually the name of the item, but you can use the `class` in a call to `getItemInfo()` to get a reliable name  
>
>> **String `date`**  
>> Likely meant for the game, such as creating limited time offers or such. Seems to be a string conversion from a unix timestamp, as sometimes the date of the epoch appears here, signalling a unix timestamp of `0`, which for all intents and purposes is a useless value.  
>
>> **Object `prices`**  
>> Prices listed by the 3-letter currency code, all prices are in the smallest division of the currency. For example, USD is represented by cents, so a value of `299` really means `$2.99`. **Notice:** sometimes the invalid `Unknown` currency appears, you should ignore that.  
>
>> **Object `pricesOriginal`**  
>> **May not be defined**. The "original" prices of the items, used in-game to show discounted prices. If you are representing this visually, you should check that the "original" price is actually less than the current price, as most of the time the "original" and current price are actually the same.  

### Example

```javascript
const api = require('steam-js-api')
api.setKey('{{YOUR KEY}}')

api.getGameItemPrices(730).then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks a lot like this one:

```json
{
    "count": 3,
    "items": [
        {
            "class": "3106078545",
            "name": "1375",
            "date": "2018-11-29",
            "prices": {
                "USD": 249,
                "GBP": 199,
                "EUR": 220,
                "RUB": 17000,
                "BRL": 979,
                "Unknown": 0,
                "JPY": 27500
            }
        },
        {
            "class": "2948967440",
            "name": "1374",
            "date": "2018-06-07",
            "prices": {
                "USD": 249,
                "GBP": 199,
                "EUR": 220,
                "RUB": 17000,
                "BRL": 979,
                "Unknown": 0,
                "JPY": 27500
            }
        },
        {
            "class": "2727231383",
            "name": "1373",
            "date": "2017-12-20",
            "prices": {
                "USD": 249,
                "GBP": 199,
                "EUR": 220,
                "RUB": 17000,
                "BRL": 979,
                "Unknown": 0,
                "JPY": 27500
            }
        }
    ]
}
```

