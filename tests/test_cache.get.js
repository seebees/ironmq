var ironCache  = require('../').IronCache;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var cacheName   = con.cacheName;
var cacheKey 	= con.cacheKey;
var cacheVal	= con.cacheVal;

if (con.proxy)
{
  var req = nock('https://' + con.ironCacheRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironCacheUserAgent)
    .get(
      '/1/projects/' + projectId + '/caches/' + cacheName + '/items/' + cacheKey)
    .reply(200
        ,{
		  "cache": cacheName,
		  "key": cacheKey,
		  "value": cacheVal
	  },{
	  	"content-type" : 'application/json'
	});
}

test('cache.get', function(t)
{
	var client = ironCache(token);
	var project = client.projects(projectId);
	var cache = project.caches(cacheName);

	cache.get(cacheKey,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.cache,cacheName);
			t.equal(obj.key,cacheKey);
			t.equal(obj.value,cacheVal);
		}
		else
		{
			t.ok(obj.cache);
			t.ok(obj.key);
			t.ok(obj.value);
		}

    	t.end();
  	});
});