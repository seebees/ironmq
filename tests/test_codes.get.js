var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var codeId    	= con.codeId;

test('task', function(t)
{
	//TODO error when !project or typeof project !== 'string'
	var client  = ironWorker(token);
  	var project = client.projects(projectId);
  	var codePackage  = project.codePackages(codeId);

 	t.ok(codePackage);
	assertIsCodePackage(t,codePackage);

  	t.end();
});

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .get(
      '/2/projects/' + projectId + '/codes?page=0&per_page=0')
    .reply(200
        ,{ codes :
		  [
			  {
				  "id": codeId,
				  "project_id": projectId,
				  "name": "MyWorker",
				  "runtime": "ruby",
				  "latest_checksum": "b4781a30fc3bd54e16b55d283588055a",
				  "rev": 1,
				  "latest_history_id": "4f32ecb4f840063758022153",
				  "latest_change": 1328737460598000000
			  }
		  ]
	  },{
	  	"content-type" : 'application/json'
	});
}

test('codes.list', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);

	project.listCodePackages(0,0,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), codeId);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var codePackage = obj[i];

			assertIsCodePackage(t,codePackage);
		}

    	t.end();
  	});
});

function assertIsCodePackage(t,codePackage)
{
	t.ok(typeof codePackage.id === 'function');
	t.ok(typeof codePackage.info  === 'function');
	t.ok(typeof codePackage.delete  === 'function');
	t.ok(typeof codePackage.download  === 'function');
	t.ok(typeof codePackage.revisions === 'function');
}

//TODO
// []
// {}
// cb
