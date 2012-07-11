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
		'/2/projects/' + projectId + '/tasks'
		, { tasks : [
				{
					"code_name": "testCode",
					"payload": "testPayload"
				}
			]
		})
		.reply(200
		, {
			msg : "Queued up",
			tasks: [
				{
					"id": taskId
				}
			]
		},{
		   "content-type" : 'application/json'
	   });
}

test('tasks.post(str,str,int,int,int, func)', function(t)
{
	var client = ironWorker(token);
	var project  = client.projects(projectId);

	project.queueTask('testCode',"testPayload", function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Queued up",
						tasks: [
							{
								"id": taskId
							}
						]
					});
		t.end();
	});
});


//TODO
// msg, not object, cb -> throw error

