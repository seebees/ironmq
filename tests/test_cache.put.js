var ironCache  = require('../').IronCache;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var project 	= con.projectId;
var cacheName  	= con.cacheName;
var cacheKey	= con.cacheKey;
var cacheVal	= con.cacheVal;

if (con.proxy)
{
  var req = nock('https://' + con.ironCacheRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironCacheUserAgent)
    .put(
      '/1/projects/' + project + '/caches/' + cacheName + '/items/' + cacheKey
      , {
		  expires_in: 86400,
		  replace: true,
		  body : cacheVal
	  })
    .reply(200
      , { msg: 'Stored.'},{
		  "content-type" : 'application/json'
	  });
}


test('cache.put(str,str,int,bool,bool,func)', function(t)
{
  var client = ironCache(token);
  var cache  = client.projects(project).caches(cacheName);

	cache.put(cacheKey,cacheVal,86400,true,null, function(err, obj)
	{
    	t.deepEqual(obj,
                    { msg: 'Stored.'});
	    t.end()
  	});
});


//TODO
// msg, not object, cb -> throw error

