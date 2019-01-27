const api = {}

var _key = ''

function setKey(key) { _key = key }

function requireKey() {
    if (_key == '')
        throw new Error('This interface requires a Web API user key. Please set one with `api.setKey()` before calling this.')
    else return _key
}

api.setKey = setKey
api.requireKey = requireKey

// Export this right away for the libs
module.exports = api

const PlayerService = require('./libs/PlayerService.js')
api.getRecentlyPlayedGames = PlayerService.getRecentlyPlayedGames
api.getOwnedGames          = PlayerService.getOwnedGames
api.getSteamLevel          = PlayerService.getSteamLevel
api.getBadges              = PlayerService.getBadges
api.getBadgeProgress       = PlayerService.getBadgeProgress

const SteamUser = require('./libs/SteamUser.js')
api.getFriendList      = SteamUser.getFriendList
api.getPlayerBans      = SteamUser.getPlayerBans
api.getPlayerSummaries = SteamUser.getPlayerSummaries
api.getUserGroups      = SteamUser.getUserGroups
api.resolveName        = SteamUser.resolveName

const SteamUserStats = require('./libs/SteamUserStats.js')
api.getGlobalAchievements = SteamUserStats.getGlobalAchievements
api.getCurrentPlayers     = SteamUserStats.getCurrentPlayers
api.getAchievements       = SteamUserStats.getAchievements
api.getGameSchema         = SteamUserStats.getGameSchema
api.getStats              = SteamUserStats.getStats

const EconService = require('./libs/EconService.js')
api.getTradeHistory = EconService.getTradeHistory
api.getTradeOffer   = EconService.getTradeOffer

const SteamEconomy = require('./libs/SteamEconomy.js')
api.getItemInfo       = SteamEconomy.getItemInfo
api.getGameItemPrices = SteamEconomy.getGameItemPrices

const Special = require('./libs/Special.js')
api.getGroupInfo = Special.getGroupInfo

// Game specific interfaces
api.CSGO = require('./libs/730_CSGO.js')

const {request, validateSteamID} = require('./libs/util.js')
api.request         = request
api.validateSteamID = validateSteamID

module.exports = api
