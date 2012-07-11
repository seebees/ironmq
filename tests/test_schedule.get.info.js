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
      '/2/projects/' + projectId + '/schedules/' + taskId)
    .reply(200
        ,{
		  "id": taskId,
		  "project_id": projectId,
		  "created_at": "2011-11-02T21:22:51Z",
		  "updated_at": "2011-11-02T21:22:51Z",
		  "msg": "Ran max times.",
		  "status": "complete",
		  "code_name": "MyWorker",
		  "delay": 10,
		  "start_at": "2011-11-02T21:22:34Z",
		  "end_at": "2262-04-11T23:47:16Z",
		  "next_start": "2011-11-02T21:22:34Z",
		  "last_run_time": "2011-11-02T21:22:51Z",
		  "run_times": 1,
		  "run_count": 1
	  },{
	  	"content-type" : 'application/json'
	});
}

test('scheduledTask.info', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var scheduledTask = project.scheduledTasks(taskId);

	scheduledTask.info(function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.id,taskId);
			t.equal(obj.project_id,projectId);
			t.equal(obj.created_at,"2011-11-02T21:22:51Z");
			t.equal(obj.updated_at,"2011-11-02T21:22:51Z");
			t.equal(obj.msg,"Ran max times.");
			t.equal(obj.status,"complete");
			t.equal(obj.code_name,"MyWorker");
			t.equal(obj.delay, 10);
			t.equal(obj.start_at,"2011-11-02T21:22:34Z");
			t.equal(obj.end_at,"2262-04-11T23:47:16Z");
			t.equal(obj.next_start,"2011-11-02T21:22:34Z");
			t.equal(obj.last_run_time,"2011-11-02T21:22:51Z");
			t.equal(obj.run_times, 1);
			t.equal(obj.run_count, 1);
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