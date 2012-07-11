var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var codeId    	= con.codeId;

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .get(
      '/2/projects/' + projectId + '/codes/' + codeId)
    .reply(200
        ,{
		  "id": codeId,
		  "project_id": projectId,
		  "name": "MyWorker",
		  "runtime": "ruby",
		  "latest_checksum": "a0702e9e9a84b758850d19ddd997cf4a",
		  "rev": 1,
		  "latest_history_id": "4eb1b241cddb13606500000c",
		  "latest_change": 1328737460598000000
	  },{
	  	"content-type" : 'application/json'
	});
}

test('code.info', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var codePackage = project.codePackages(codeId);

	codePackage.info(function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.id,codeId);
			t.equal(obj.project_id,projectId);
			t.equal(obj.name,"MyWorker");
			t.equal(obj.runtime,"ruby");
			t.equal(obj.latest_checksum,"a0702e9e9a84b758850d19ddd997cf4a");
			t.equal(obj.rev,1);
			t.equal(obj.latest_history_id,"4eb1b241cddb13606500000c");
			t.equal(obj.latest_change,1328737460598000000);
		}
		else
		{
			t.ok(obj.id);
			t.ok(obj.project_id);
			t.ok(obj.name);
			t.ok(obj.runtime);
			t.ok(obj.latest_checksum);
			t.ok(obj.rev);
			t.ok(obj.latest_history_id);
			t.ok(obj.latest_change);
		}

    	t.end();
  	});
});