# Special

Custom functions that don't use the traditional Steam Web API stuff. As such, they are likely to change in functionality at some point in the future. For now these are safe to use in production, but be warned!

<br />

| Method | Description |
| :--- | :--- |
| [GetGroupInfo](#GetGroupInfo) | Retrieve detailed information about a community group. |

<br />

## GetGroupInfo
<sub>[[to top of page]](#Special)</sub>

**Does *NOT* require an API Key! Yay!**

Retrieve detailed information about a community group. Like player summaries but for groups!
### Syntax
`getGroupInfo(id[, type])`
### Parameters

`id` *required*
> Type: `String`  
>  
> Group 64-bit ID, short ID, or vanity url name. The 64-bit ID is used in just about all places on the Steam site, the vanity name only appears as the URL, and the short ID is only visible to group admins and through the [GetUserGroupList](ISteamUser#GetUserGroupList) API. All of these work just the same, however you should favor the 64-bit ID over the short ID and name when you can.

`type`
> Type: `String`  
> Default: `gid`  
>  
> Type of ID for the group, supported values are `gid` and `group`. Use `gid` for the number IDs, and `group` for the vanity url name.


### Result

> **String `gid`**  
> Full group ID number. Fun trivia, Steam seems to only use the last 32 bits internally. Check out the hexadecimal format of any gid!  
>
> **String `name`**  
> Unique group name, locked on group creation. This is NOT THE VANITY URL, and as such DOES NOT WORK FOR GETTING GROUP INFO.  
>
> **String `vanityName`**  
> The unique group url name, can be changed at any time by group admins  
>
> **String `summary`**  
> HTML code for the group description, since this comes from Steam it is safe to be rendered right on your own web pages, however keep in mind that all links are redirected to the Steam link filter  
>
> **Integer `members`**  
> Total number of members in the group, slightly smaller than the true number due to private accounts not being included in this count  
>
> **Integer `membersReal`**  
> True number of members in the group, although the regular `members` count is more accurate because it doesn't include all the private profiles  
>
> **Integer `membersOnline`**  
> Number of members currently online  
>
> **Integer `membersGame`**  
> Number of members playing a game  
>
> **Integer `membersChat`**  
> Number of members in the group chat room  
>
> **Object `logo`**  
> Holds the various urls for the group logo sizes  
>> **String `small`**  
>> URL for the 32x32 logo  
>
>> **String `medium`**  
>> URL for the 64x64 logo  
>
>> **String `large`**  
>> URL for the 184x184 logo  

### Example

```javascript
const api = require('steam-js-api')

api.getGroupInfo('103582791435315066').then(result => {
    console.log(result.data)
}).catch(console.error)
```

This would display an object that looks like this one:

```json
{
    "gid": "103582791435315066",
    "name": "DINOSOWER1337",
    "vanityName": "DINOSOWEROfficial",
    "summary": "Welcome to the group anyone can wear the tag! not like I can stop em :)<br><br>There's only two types of players in dinosower. Cheaters and people who arent better than me.",
    "members": 415842,
    "membersReal": 453019,
    "membersOnline": 24858,
    "membersGame": 2695,
    "membersChat": 429,
    "logo": {
        "small": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ea/eafb277c3504bf10fe6d800d96ea074516a47f4e.jpg",
        "medium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ea/eafb277c3504bf10fe6d800d96ea074516a47f4e_medium.jpg",
        "large": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ea/eafb277c3504bf10fe6d800d96ea074516a47f4e_full.jpg"
    }
}
```

