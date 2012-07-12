var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	= con.token
var project 	= con.project
var cacheName  	= con.cache
var cacheKey	= con.cache_key
var cacheVal	= con.cache_val

if (con.proxy)
{
  var req = nock(con.cache_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .put('/1/projects/' + project + '/caches/' + cacheName + '/items/' + cacheKey
      , { expires_in: 86400
        , replace: true
        , body : cacheVal})
    .reply(200
      , { msg: 'Stored.'},{
		  'content-type' : 'application/json'
	  })
}


test('cache.put(str,str,int,bool,bool,func)', function(t) {
  var client = iron(token).cache
  var cache  = client.projects(project).caches(cacheName)

	cache.put(cacheKey
          , cacheVal
          , { expires_in: 86400
            , replace: true }
          , function(err, obj) {
              t.deepEqual(obj, { msg: 'Stored.'})
              t.end()
            })
})


//TODO
// msg, not object, cb -> throw error

