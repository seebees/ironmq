var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var taskId    	= con.taskId;

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .get(
      '/2/projects/' + projectId + '/tasks/' + taskId)
    .reply(200
        ,{
		  "id": taskId,
		  "project_id": projectId,
		  "code_id": "4eb1b46fcddb13606500000e",
		  "code_history_id": "4eb1b46fcddb13606500000f",
		  "status": "complete",
		  "code_name": "MyWorker",
		  "code_rev": "1",
		  "start_time": 1320268924000000000,
		  "end_time": 1320268924000000000,
		  "duration": 43,
		  "timeout": 3600
	  },{
	  	"content-type" : 'application/json'
	});
}

test('task.info', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var task = project.tasks(taskId);

	task.info(function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.id,taskId);
			t.equal(obj.project_id,projectId);
			t.equal(obj.code_id,"4eb1b46fcddb13606500000e");
			t.equal(obj.code_history_id,"4eb1b46fcddb13606500000f");
			t.equal(obj.status,"complete");
			t.equal(obj.code_name,"MyWorker");
			t.equal(obj.code_rev,"1");
			t.equal(obj.start_time,1320268924000000000);
			t.equal(obj.end_time,1320268924000000000);
			t.equal(obj.duration,43);
			t.equal(obj.timeout,3600);
		}
		else
		{
			t.ok(obj.id);
			t.ok(obj.project_id);
			t.ok(obj.code_id);
			t.ok(obj.code_history_id);
			t.ok(obj.status);
			t.ok(obj.code_name);
			t.ok(obj.code_rev);
			t.ok(obj.start_time);
			t.ok(obj.end_time);
			t.ok(obj.duration);
			t.ok(obj.timeout);
		}

    	t.end();
  	});
});