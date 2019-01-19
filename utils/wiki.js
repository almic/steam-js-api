const fs = require('fs')
const wiki = require('./wiki.json')

function printObject(obj, depth) {
    let data = ''
    depth = depth || 0

    for (prop in obj) {
        // Check if we can remove extra lines from previous pass, removing empty lines before the previous line
        data = data.split('\r\n')
        if (data.length > 7) {
            // Earliest this can happen is by line 7
            // Check all trailing line, and remove empty ones, except the very last one, until a non-empty line is found
            for (let i = data.length - 3;;) {
                if (/^>*$/.test(data[i])) {
                    data.splice(i, 1)
                    i--
                } else {
                    break
                }
            }
        }
        data = data.join('\r\n')
        let d = depth
        while (d > 0) { data += '>'; d-- }
        data += '> **'
        data += obj[prop].type
        data += ' `'
        data += prop
        data += '`**  \r\n'
        prop = obj[prop]
        d = depth
        while (d > 0) { data += '>'; d-- }
        data += '> '
        data += prop.desc
        data += '  \r\n'
        if (prop.hasOwnProperty('object')) {
            data += printObject(prop.object, depth + 1)
        }
        d = depth - 1
        while (d > 0) { data += '>'; d-- }
        data += '>\r\n'
    }

    if (depth == 0) {
        // Delete all trailing lines
        data = data.split('\r\n')
        for (let i = data.length - 2;;) {
            if (/^>*$/.test(data[i])) {
                data.splice(i, 1)
                i--
            } else {
                break
            }
        }
        data = data.join('\r\n')
    }

    return data
}

for (page in wiki) {
    // As this is a JSON file, there is no reason to check properties

    let data = ''
    let table = '| Method | Description |\r\n| :--- | :--- |\r\n'
    let pageName = page
    page = wiki[page]

    for (section in page) {
        if (section == 'desc')
            continue

        table += `| [${section}](#${section}) | `

        data += `## ${section}\r\n<sub>[[to top of page]](#${pageName})</sub>\r\n\r\n`
        section = page[section]
        table += `${section.desc.slice(0, section.desc.indexOf('.') + 1)} |\r\n`
        if (Boolean(section.noKey))
            data += `**Does *NOT* require an API Key! Yay!**\r\n\r\n`
        data += `${section.desc}\r\n### Syntax\r\n\`${section.function}(`

        let params = section.parameters
        let list = ''
        let count = 0
        let opts = 0
        for (param in params) {
            list += `\`${param}\``

            if (params[param].hasOwnProperty('default')) {
                data += '['
                opts++
            } else {
                list += ` *required*`
            }

            if (count) data += ', '
            data += param
            count++
            param = params[param]

            list += `\r\n> Type: \`${param.type}\`  \r\n`

            if (param.hasOwnProperty('default'))
                list += `> Default: \`${param.default}\`  \r\n`

            list += `>  \r\n> ${param.desc}\r\n\r\n`

        }
        while (opts > 0) {
            data += ']'
            opts--
        }

        data += `)\`\r\n### Parameters\r\n\r\n${list}\r\n`

        data += `### Result\r\n\r\n${printObject(section.result)}\r\n`
        data += '### Example\r\n\r\n```javascript\r\n'
        data += `const api = require('steam-js-api')\r\n`
        if (!Boolean(section.noKey))
            data += `api.setKey('{{YOUR KEY}}')\r\n`
        data += '\r\n'
        data += `api.${section.example_call}.then(result => {\r\n`
        data += `    console.log(result.data)\r\n`
        data += '}).catch(console.error)\r\n'
        data += '```\r\n\r\n'
        data += 'This would display an object that looks a lot like this one:\r\n\r\n```json\r\n'
        data += JSON.stringify(section.example_data, null, 4)
        data += '\r\n```\r\n\r\n'
    }

    data = `# ${pageName}\r\n\r\n${page.desc}\r\n\r\n<br />\r\n\r\n${table}\r\n<br />\r\n\r\n${data}`

    // Save to wiki markdown file
    fs.writeFileSync(`wiki/${pageName}.md`, data)

    console.log(`File 'wiki/${pageName}.md created with ${data.length} bytes!`)
}

// Custom game stats
const STATS = require('./../json/stats-min.json')

// Defined games
const CSGO = require('./../json/specs/csgo.js')

let games = {CSGO}

let desc = `The custom stat object structure for this game. Instead of using the original names from
the Web API, you have to use these names to access data about the player.\r\n\r\n`

desc += `Why? Because the data from the Steam Web API is very shallow, and stupidly returns an array
of objects instead of a single object with many properties. All stats are converted to a single
object in this library, making it a lot easier to access the data. This improves your experience
when working with stats. In the Steam Web API, some names aren't very obvious, some data tracks
totally different values than the schema suggests, and some stats are literally never tracked
despite being in the schema. To fix that problem, a custom object definition is required.\r\n\r\n`

desc += `With a custom object definition, names are more accurate, data is easier to access, and it
offers some extra documentation for the original stat names in the Web API. If you want to create a
custom object definition for your game, go ahead and check out the \`json\` folder in the
repository, and review the \`stats.json\` file and the \`specs/csgo.js\` file to see how it works.
Once you built a similar structure, go ahead and create a pull-request to add it to the project.`

let notice = `Due to the nature of the Web API, and to save space, unset stats are not returned in
these objects. It's possible for a stat to be tracked, but not yet set for the player. This is true
for achievements; any non-unlocked achievements will simply not be returned by the Web API at all.
The same goes for stats. Before attempting to access any values, check that the exact path of
objects already exists. Also remember that certain stats can have default values, so if they are
unset, you should assume the default value specified in the schema as its true value.`

function addProp(o, s, v) {
    if (s.length > 2) {
        let k = s.shift()
        if (!(k in o)) {
            o[k] = {type: 'Object', desc: '', object: addProp({}, s, v)}
        } else {
            o[k].object = addProp(o[k].object, s, v)
        }
    } else if (s.length == 2) {
        let k = s.shift()
        if (!(k in o)) {
            o[k] = {type: 'Object', desc: '', object: {}}
        }
        o[k].object[s[0]] = v
    } else {
        o[s.shift()] = v
    }
    return o
}

// Create pages
for (game in games) {

    let data = ''
    let pageName = game
    game = games[game]

    let struct = STATS[game.appID]
    let converted = {}

    // Convert to printable object
    for (stat in struct) {
        let name = stat
        stat = struct[stat]

        // stat.desc += '<br/>Web API: `' + name + '`'

        converted = addProp(converted, stat.name.split('.'), {type: "Integer", desc: stat.desc})
    }

    data += `## Structure\r\n\r\n${printObject(converted)}\r\n\r\n`
    data += '## Example\r\n\r\n```json\r\n'
    data += JSON.stringify(game.example, null, 4)
    data += '\r\n```\r\n\r\n'

    data = `# Stat Structure for ${pageName}\r\n\r\n## What is this?\r\n\r\n${desc}\r\n\r\n## NOTICE\r\n\r\n${notice}\r\n\r\n${data}`

    // Save to wiki markdown file
    fs.writeFileSync(`wiki/Stats-${pageName}.md`, data)

    console.log(`File 'wiki/Stats-${pageName}.md created with ${data.length} bytes!`)
}
