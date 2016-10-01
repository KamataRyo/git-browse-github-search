/**
 * make request to search github and execute callback with the result
 * @param  {String}   user      [Github username]
 * @param  {String}   repo      [Github repository search string]
 * @param  {String}   protocol  [Replace protocol for the request]
 * @param  {String}   host      [Replace host for the request]
 * @param  {String}   directory [Replace directory for the request]
 * @param  {Function} success [description]
 * @param  {Function} failure [description]
 */

var fs = require('fs')
var meta = require('./package.json')
var home = process.env.HOME || process.env.USERPROFILE
var cacheFile = `${home}/${meta.config.history}`
var search = (args) => {

  var user      = args.user      || undefined
  var repo      = args.repo      || ''
  var protocol  = args.protocol  || meta.config.protocol
  var host      = args.host      || meta.config.host
  var directory = args.directory || meta.config.directory

  /**
   * Callback for search success
   * @param  {[type]} givenArg   [argument]
   * @return {[Object]}        [description]
   */
  var success = (givenArg) => {
    if (typeof args.success == 'function') {
      return args.success(givenArg)
    }
  }

  /**
   * Callback for search failure
   * @param  {[type]} givenArg [description]
   * @return {[type]}        [description]
   */
  var failure = (givenArg) => {
    if (typeof args.failure == 'function') {
      args.failure(givenArg)
    }
  }

  // check arguments
  if (!user) {
    failure(new Error('No user field given.'));
    return
  }

  // modules and parameter requirement
  var request = require('request')

  var query = `${repo}+user:${user}`

  // build request option
  var options = {
    method: 'GET',
    uri: `${protocol}://${host}/${directory}?q=${query}`,
    headers: {
      'User-Agent': 'git-browse'
    }
  }

  getCache(options.uri, (val) => {
    if (val) {
      success(val)

    } else {
      // make request
      request(options, (err, res, body) => {

        var results = []
        // When obtained correct result..
        if (!err) {
          try {
            var items = JSON.parse(body).items
            if (Array.isArray(items)) {
              items.forEach((item) => {
                var regexp = new RegExp(`^${repo}`)
                if (item.name.match(regexp)) {
                  results.push(item.name)
                }
              })
            }
            setCache(options.uri, results, meta.config.ttl)
            success(results)
          } catch (e) {
            failure(e)
          }
        } else {
          failure(err)
        }
      })
    }
  })
}

var getAllCache = callback => {
  var history = '';
  fs.createReadStream(cacheFile, {encoding: 'utf-8'})
    .on('error', () => callback({}))
    .on('data', (data) => history += data)
    .on('end', () => {
      try {
        var result = JSON.parse(history)
        callback(result)
      } catch (e) {
        callback({})
      }
    })
}

var deleteCache = (key, callback) => {
  getAllCache(history => {
    delete history[key]
    var ws = fs.createWriteStream(cacheFile)
    if (typeof callback == 'function') {
      ws.on('close', callback)
    }
    ws.write(JSON.stringify(history))
    ws.end()
  })
}

var getCache = (key, callback) => {
  getAllCache(history => {
    var defined = key in history
    if (defined) {
      var expired = new Date(history[key].expireAt) < new Date()
      if (!expired) {
        callback(history[key].value)
      } else {
        deleteCache(key)
        callback(undefined)
      }
    } else {
      callback(undefined)
    }
  })
}

var setCache = (key, value, expire, callback) => {
  getAllCache(history => {
    var now = new Date()
    history[key] = {
      value,
      expireAt: now.setSeconds(now.getSeconds() + expire )
    }
    var ws = fs.createWriteStream(cacheFile)
    if (typeof callback == 'function') {
      ws.on('close', callback)
    }
    ws.write(JSON.stringify(history))
    ws.end()
  })
}

module.exports = {
  search,
  deleteCache,
  getAllCache,
  setCache,
  getCache,
}
