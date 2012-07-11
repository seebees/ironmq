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
      '/2/projects/' + projectId + '/codes/' + codeId + '/revisions?page=0&per_page=0')
    .reply(200
        ,{
		  "revisions": [
			  {
				  "id": "4f32d9c81cf75447be020ea6",
				  "code_id": codeId,
				  "project_id": projectId,
				  "rev": 1,
				  "runtime": "ruby",
				  "name": "MyWorker",
				  "file_name": "worker.rb"
			  },
			  {
				  "id": "4f32da021cf75447be020ea8",
				  "code_id": codeId,
				  "project_id": projectId,
				  "rev": 2,
				  "runtime": "ruby",
				  "name": "MyWorker",
				  "file_name": "worker.rb"
			  }
		  ]
	  },{
	  	"content-type" : 'application/json'
	});
}

test('code.revisions', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var codePackage = project.codePackages(codeId);

	codePackage.revisions(0,0,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 2);
			t.equal(obj[0].code_id, codeId);
			t.equal(obj[0].project_id, projectId);
			t.equal(obj[1].code_id, codeId);
			t.equal(obj[1].project_id, projectId);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var revision = obj[i];

			assertIsRevision(t,revision);
		}

    	t.end();
  	});
});

function assertIsRevision(t,revision)
{
	t.ok(revision.id);
	t.ok(revision.code_id);
	t.ok(revision.project_id);
	t.ok(revision.rev);
	t.ok(revision.runtime);
	t.ok(revision.name);
	t.ok(revision.file_name);
}