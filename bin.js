#!/usr/bin/env node

/**
 * This file is Entry point for the CLI interface.
 * STDOUT will be search result with Github API
 */
var search = require('./index').search

var user = process.argv.length > 2 ? process.argv[2] : null
var repo = process.argv.length > 3 ? process.argv[3] : null

search({
  user,
  repo,
  success: comps => {
    console.log(`${comps.join(' ')}`)
  },
  failure: (err) => {
    console.log(err)
  }
})
