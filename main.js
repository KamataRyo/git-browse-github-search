#!/usr/bin/env node

/**
 * This file is Entry point for the CLI interface.
 * STDOUT will be search result with Github API
 */
var getRepocomps = require('./lib').getRepocomps

var user = process.argv.length > 2 ? process.argv[2] : undefined
var repo = process.argv.length > 3 ? process.argv[3] : undefined

getRepocomps(user, repo, (comps) => {
  console.log(`${comps.join(' ')}`)
})
