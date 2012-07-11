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
		'/2/projects/' + projectId + '/tasks/' + taskId + "/progress"
		,{
			percent: 25,
			msg: "test message"
		})
		.reply(200
		, {
			msg : "Progress Set"
		},{
		   "content-type" : 'application/json'
	   });
}

test('task.progress(int,msg,func)', function(t)
{
	var client = ironWorker(token);
	var project  = client.projects(projectId);
	var task = project.tasks(taskId);

	task.progress(25,"test message",function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Progress Set"
					});
		t.end();
	});
});
