const fs = require('fs')
const wiki = require('./wiki.json')

function printObject(obj, depth) {
    let data = ''
    depth = depth || 0

    for (prop in obj) {
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
        data += '>  \r\n'
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
                if (!count) data += ', '
                opts++
            } else {
                list += ` *required*`
            }
            data += param
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
