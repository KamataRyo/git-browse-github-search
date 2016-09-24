#!/usr/bin/env node

getRepocomps = (user, repo, callback) => {

    var request = require('request')
    var options = {
        url: 'https://api.github.com/search/repositories',
        headers: {
            'User-Agent': 'git-browse'
        }
    }

    if (user && repo) {
        options.url += `?q=${repo}+user:${user}`
    } else if (user) {
        options.url += `?q=user:${user}`
    }

    request(options, (err, res, body) => {
        comps = []
        JSON.parse(body).items
            .forEach((item) => {
                var regexp = new RegExp(`^${repo}`)
                if (item.name.match(regexp)) {
                    comps.push(item.name)
                }
            })
        if (typeof callback == 'function') {
            callback(comps)
        }
    })
}


getRepocomps(process.argv[2], process.argv[3], (comps) => {
    console.log(`${comps.join(' ')}`)
})
