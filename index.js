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

  // build request option
  var options = {
    method: 'GET',
    uri: `${protocol}://${host}/${directory}?q=${repo}+user:${user}`,
    headers: {
      'User-Agent': 'git-browse'
    }
  }

  // make request
  request(options, (err, res, body) => {
    /**
    * contain result
    * @type {Array}
    */
    var comps = []

    /**
    * items parsed from response
    * @type {[type]}
    */
    // When obtained correct result..
    if (!err) {
      try {
        var items = JSON.parse(body).items
        if (Array.isArray(items)) {
          items.forEach((item) => {
            var regexp = new RegExp(`^${repo}`)
            if (item.name.match(regexp)) {
              comps.push(item.name)
            }
          })
        }
        success(comps)
      } catch (e) {
        failure(e)
      }
    } else {
      failure(err)
    }
  })
}

var getAllCache = (callback) => {
  var home = (process.env.HOME || process.env.USERPROFILE)
  fs.readFile(`${home}/${meta.config.history}`, 'utf-8', (err, text) => {
    // file not found
    if (err) {
      callback({})
    } else {
      callback(JSON.parse(text))
    }
  })
}

module.exports = {
  search,
  getAllCache
}
