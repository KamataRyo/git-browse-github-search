/**
 * make request to search github and execute callback with the result
 * @param  {String}   user     [Github username]
 * @param  {String}   repo     [Github repository search string]
 * @param  {Function} success [description]
 * @param  {Function} failure [description]
 */
module.exports = (args) => {

  var meta = require('./package.json')

  /**
   * Github User Name
   * @type {[String]}
   */
  var user = args.user || undefined

  /**
   * Github Repository name or foward-matching serch word.
   * @type {[String]}
   */
  var repo = args.repo || undefined

  var protocol = args.protocol || meta.config.protocol

  var host = args.host || meta.config.host

  /**
   * Callback for search success
   * @param  {[type]} givenArg   [argument]
   * @return {[Object]}        [description]
   */
  var success = (givenArg) => {
    if (typeof args.success == 'function') {
      return args.success(givenArg)
    }
    return undefined
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
    return undefined
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
    uri: `${protocol}://${host}/search/repositories`,
    headers: {
      'User-Agent': 'git-browse'
    }
  }
  if (user && repo) {
    options.uri += `?q=${repo}+user:${user}`
  } else {
    options.uri += `?q=user:${user}`
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

    if (!err && res.statusCode == 200) {
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
    } else {
      if (err) {
        failure(err)
      } else if (res.statusCode != 200) {
        failure(new Error(`Request finished with statusCode ${res.statusCode}`))
      } else {
        failure(new Error('Irregular json response.'))
      }
    }
  })
}
