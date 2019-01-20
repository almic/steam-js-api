# ISteamEconomy

Steam economy item related stuff. Be sure to look at [IEconService](IEconService) for trading stuff.

<br />

| Method | Description |
| :--- | :--- |
| [GetAssetClassInfo](#GetAssetClassInfo) | Access item specific details by `class` and `instance` IDs. |

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
> Steam internal app id, can also be a string

`items` *required*
> Type: `Object/ Array of Objects`  
>  
> An object or array of objects defining items. They must include a `class` id, and may optionally include an `instance` id to get more specific details about the item.


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

