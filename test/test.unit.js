var {search, getAllCache} = require('../index')
var should = require('should')
var fs = require('fs')
var meta = require('../package.json')

var home = (process.env.HOME || process.env.USERPROFILE)
var historyFile = `${home}/${meta.config.history}`

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

  it('should fails without username', done => {
    var options = {
      failure: err => {
        err.should.be.an.Object()
        done()
      }
    }
    search(options)
  })

  it('should fails with unknown hosts', done => {
    var options = {
      user: 'KamataRyo',
      host: 'iregal characters {}{}{}',
      failure: err => {
        err.should.be.an.Object()
        done()
      }
    }
    search(options)
  })

  it('should fails with non-JSON page', done => {
    var options = {
      user: 'KamataRyo',
      host: 'github.com',
      directory: 'kamataryo',
      failure: err => {
        err.should.be.an.Object()
        done()
      }
    }
    search(options)
  }).timeout(20000)
})

describe('test of caching', () => {
  it('should not read the history file if not existing', done => {
    //
    fs.unlink(historyFile, () => {
      getAllCache(history => {
        should.equal(Object.keys(history).length, 0)
        done()
      })
    })
  })

  it('should read file if exists', done => {
    var ws = fs.createWriteStream(historyFile)
      .on('close', () => {
        getAllCache(history => {
          history.key.should.equal('value')
          done()
        })
      })

    ws.write('{"key":"value"}')
    ws.end()
  })

})
