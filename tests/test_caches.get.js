var ironCache  = require('../').IronCache;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var cacheName   = con.cacheName;

test('cache', function(t)
{
	//TODO error when !project or typeof project !== 'string'
	var client  = ironCache(token);
  	var project = client.projects(projectId);
  	var cache  = project.caches(cacheName);

 	t.ok(cache);
	assertIsCache(t,cache);

  	t.end();
});

if (con.proxy)
{
  var req = nock('https://' + con.ironCacheRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironCacheUserAgent)
    .get(
      '/1/projects/' + projectId + '/caches?page=0')
    .reply(200
        ,[
		  {
          	project_id    : projectId,
          	name          : cacheName
		  }
	  ],{
	  	"content-type" : 'application/json'
	});
}

test('caches.list', function(t)
{
	var client = ironCache(token);
	var project = client.projects(projectId);

	project.listCaches(0,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), cacheName);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var cache = obj[i];

			assertIsCache(t,cache);
		}

    	t.end();
  	});
});

function assertIsCache(t,cache)
{
	t.ok(typeof cache.id === 'function');
	t.ok(typeof cache.put  === 'function');
	t.ok(typeof cache.inc  === 'function');
	t.ok(typeof cache.get  === 'function');
	t.ok(typeof cache.del === 'function');
}

//TODO
// []
// {}
// cb
