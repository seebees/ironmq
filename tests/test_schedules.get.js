var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var taskId    	= con.taskId;

test('schedule', function(t)
{
	//TODO error when !project or typeof project !== 'string'
	var client  = ironWorker(token);
  	var project = client.projects(projectId);
  	var scheduledTask  = project.scheduledTasks(taskId);

 	t.ok(scheduledTask);
	assertIsScheduledTask(t,scheduledTask);

  	t.end();
});

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .get(
      '/2/projects/' + projectId + '/schedules?page=0&per_page=0')
    .reply(200
        ,{ schedules : [
		  {
			  "id": taskId,
			  "project_id": projectId,
			  "created_at": "2012-02-14T03:06:41Z",
			  "updated_at": "2012-02-14T03:06:41Z",
			  "msg": "Ran max times.",
			  "status": "complete",
			  "code_name": "MyWorker",
			  "start_at": "2011-11-02T21:22:34Z",
			  "end_at": "2262-04-11T23:47:16Z",
			  "next_start": "2011-11-02T21:22:34Z",
			  "last_run_time": "2011-11-02T21:22:51Z",
			  "run_times": 1,
			  "run_count": 1
		  }]
	  },{
	  	"content-type" : 'application/json'
	});
}

test('scheduledTasks.list', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);

	project.listScheduledTasks(0,0,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), taskId);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var task = obj[i];

			assertIsScheduledTask(t,task);
		}

    	t.end();
  	});
});

function assertIsScheduledTask(t,scheduledTask)
{
	t.ok(typeof scheduledTask.id === 'function');
	t.ok(typeof scheduledTask.info  === 'function');
	t.ok(typeof scheduledTask.cancel  === 'function');
}

//TODO
// []
// {}
// cb
