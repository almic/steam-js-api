const {doRequest} = require('./util.js')

function getGroupInfo(id, type, callback) {

    let types = {
        'gid': 'gid',
        'group': 'groups'
    }

    if (typeof type === 'function') {
        callback = type
        type = 'gid'
    } else if (!type) {
        type = 'gid'
    }

    function run(resolve, reject) {

        if (typeof type === 'string') {
            if (types.hasOwnProperty(type)) {
                type = types[type]
            } else {
                let result = {error: 'Requested type does not correlate to a possible type.'}
                if (reject) reject(result)
                else resolve(result)
            }
        } else if (!Object.values(types).includes(type)) {
            let result = {error: 'Requested type does not correlate to a possible type.'}
            if (reject) reject(result)
            else resolve(result)
        }

        doRequest(`https://steamcommunity.com/${type}/${id}/memberslistxml/?xml=1`, result => {
            if (result.error) {

                if (reject) reject(result)
                else resolve(result)

                return
            }

            if (typeof result.data === 'string'){
                let response = result.data

                let counts = response.match(/<memberCount>([0-9]*?)<\/memberCount>/g) || ['','']

                let data = {
                    gid: (response.match(/<groupID64>([0-9]*?)<\/groupID64>/) || {1:0})[1],
                    name: (response.match(/<groupName><!\[CDATA\[(.*?)\]\]><\/groupName>/) || {1:false})[1],
                    vanityName: (response.match(/<groupURL><!\[CDATA\[(.*?)\]\]><\/groupURL>/) || {1:false})[1],
                    summary: (response.match(/<summary><!\[CDATA\[(.*?)\]\]><\/summary>/) || {1:false})[1],
                    members: Number((counts[0].match(/<memberCount>([0-9]*?)<\/memberCount>/) || {1:0})[1]) || 0,
                    membersReal: Number((counts[1].match(/<memberCount>([0-9]*?)<\/memberCount>/) || {1:0})[1]) || 0,
                    membersOnline: Number((response.match(/<membersOnline>([0-9]*?)<\/membersOnline>/) || {1:0})[1]) || 0,
                    membersGame: Number((response.match(/<membersInGame>([0-9]*?)<\/membersInGame>/) || {1:0})[1]) || 0,
                    membersChat: Number((response.match(/<membersInChat>([0-9]*?)<\/membersInChat>/) || {1:0})[1]) || 0,
                    logo: {
                        small: (response.match(/<avatarIcon><!\[CDATA\[(.*?)\]\]><\/avatarIcon>/) || {1:false})[1],
                        medium: (response.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) || {1:false})[1],
                        large: (response.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || {1:false})[1]
                    }
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

lib.getGroupInfo = getGroupInfo

module.exports = lib
