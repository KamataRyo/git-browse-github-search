var search = require('../index')
require('should')

describe('Test of requests', () => {
  it('should make request with username', done => {
    var options = {
      user: 'KamataRyo',
      success: comps => {
        comps.should.be.an.Array()
        done()
      },
      failure: result => {
        console.log(result)
      }
    }
    search(options)
  }).timeout(20000)

  it('should make request with username and reponame', done => {
    var options = {
      user: 'KamataRyo',
      repo: 'git-',
      success: comps => {
        comps.should.containEql('git-browse-github-search')
        done()
      },
      failure: result => {
        console.log(result)
      }
    }
    search(options)
  }).timeout(20000)

  it(' should failes request without username', done => {
    var options = {
      failure: err => {
        err.should.be.an.Object()
        done()
      }
    }
    search(options)
  })

})
