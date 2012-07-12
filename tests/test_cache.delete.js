var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	= con.token
var projectId 	= con.project
var cacheName   = con.cache
var cacheKey 	= con.cache_key

if (con.proxy) {
  var req = nock(con.cache_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .delete(
      '/1/projects/' + projectId + '/caches/' + cacheName + '/items/' + cacheKey)
    .reply(200
        ,{
		  'msg':'Deleted.'
	  },{
	  	'content-type' : 'application/json'
	})
}

test('code.delete', function(t) {
	var client = iron(token).cache
	var project = client.projects(projectId)
	var cache = project.caches(cacheName)

	cache.del(cacheKey,function(err, obj) {
		t.deepEqual(obj, { msg: 'Deleted.'})
		t.end()
  	})
})
