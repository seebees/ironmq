var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token    	= con.token;
var projectId 	= con.projectId;
var taskId  	= con.taskId;

if (con.proxy)
{
	var req = nock('https://' + con.ironWorkerRootUrl)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.ironWorkerUserAgent)
		.post(
		'/2/projects/' + projectId + '/schedules/' + taskId + "/cancel")
		.reply(200
		, {
			msg : "Cancelled"
		},{
		   "content-type" : 'application/json'
	   });
}

test('scheduledTask.cancel(func)', function(t)
{
	var client = ironWorker(token);
	var project  = client.projects(projectId);
	var scheduledTask = project.scheduledTasks(taskId);

	scheduledTask.cancel(function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Cancelled"
					});
		t.end();
	});
});
