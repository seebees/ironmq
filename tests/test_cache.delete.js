var ironCache  = require('../').IronCache;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var cacheName   = con.cacheName;
var cacheKey 	= con.cacheKey;

if (con.proxy)
{
  var req = nock('https://' + con.ironCacheRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironCacheUserAgent)
    .delete(
      '/1/projects/' + projectId + '/caches/' + cacheName + '/items/' + cacheKey)
    .reply(200
        ,{
		  "msg":"Deleted."
	  },{
	  	"content-type" : 'application/json'
	});
}

test('code.delete', function(t)
{
	var client = ironCache(token);
	var project = client.projects(projectId);
	var cache = project.caches(cacheName);

	cache.del(cacheKey,function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Deleted."
					});
		t.end();
  	});
});