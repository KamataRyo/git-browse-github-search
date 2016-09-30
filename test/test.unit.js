var getRepocomps = require('../lib').getRepocomps
require('should')

describe('Test of requests', () => {
  it('can make request with username', (done) => {
    var options = {
      user: 'KamataRyo',
      success: (comps) => {
        comps.should.be.an.Array()
        done()
      },
      failure: (result) => {
        console.log(result)
      }
    }
    getRepocomps(options)
  }).timeout(20000)

  it('can make request with username and reponame', (done) => {
    var options = {
      user: 'KamataRyo',
      repo: 'git-',
      success: (comps) => {
        comps.should.containEql('git-browse-github-search')
        done()
      },
      failure: (result) => {
        console.log(result)
      }
    }
    getRepocomps(options)
  }).timeout(20000)
})
