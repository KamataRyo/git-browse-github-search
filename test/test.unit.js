var {
  search,
  getAllCache,
  deleteCache, setCache, getCache} = require('../index')
var should = require('should')
var fs = require('fs')
var meta = require('../package.json')

var home = (process.env.HOME || process.env.USERPROFILE)
var cacheFile = `${home}/${meta.config.history}`

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
    fs.unlink(cacheFile, () => {
      getAllCache(history => {
        should.equal(Object.keys(history).length, 0)
        done()
      })
    })
  })

  it('should read file if exists', done => {
    fs.unlink(cacheFile, () => {
      var ws = fs.createWriteStream(cacheFile)
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

  it('should delete cached value', done => {
    fs.unlink(cacheFile, () => {
      var ws = fs.createWriteStream(cacheFile)
        .on('close', () => {
          deleteCache('key1', () =>
            getAllCache(history => {
              should.equal(Object.keys(history).length, 0)
              done()
            })
          )
        })

      ws.write('{"key1":"value1"}')
      ws.end()
    })
  })

  it('should set and serve cache', done => {
    fs.unlink(cacheFile, () => {
      setCache('key2', 'value2', 60, () => {
        getCache('key2', val => {
          val.should.equal('value2')
          done()
        })
      })
    })
  })

  it('should not get undefined cache', done => {
    fs.unlink(cacheFile, () => {
      setCache('key3', 'value3', 60, () => {
        getCache('undefined-key', val => {
          should.equal(val, undefined)
          done()
        })
      })
    })
  })

  it('should expire cache', done => {
    fs.unlink(cacheFile, () => {
      setCache('key3', 'value3', 1, () => {
        setTimeout(() => {
          getCache('key3', val => {
            should.equal(val, undefined)
            done()
          })
        }, 2000)
      })
    })
  }).timeout(3000)

})
