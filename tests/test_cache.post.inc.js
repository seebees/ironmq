var ironCache  = require('../').IronCache;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token    	= con.token;
var projectId 	= con.projectId;
var cacheName  	= con.cacheName;
var cacheKey	= con.cacheKey;

if (con.proxy)
{
	var req = nock('https://' + con.ironCacheRootUrl)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.ironCacheUserAgent)
		.post(
		'/1/projects/' + projectId + '/caches/' + cacheName + "/items/" + cacheKey + "/increment"
		,{
			amount: 10
		})
		.reply(200
		, {
			msg : "Added.",
			value: 132
		},{
		   "content-type" : 'application/json'
	   });
}

test('cache.inc(str,int,func)', function(t)
{
	var client = ironCache(token);
	var project  = client.projects(projectId);
	var cache = project.caches(cacheName);

	cache.inc(cacheKey,10,function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Added.",
						value: 132
					});
		t.end();
	});
});
