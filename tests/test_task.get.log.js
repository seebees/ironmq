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
      '/2/projects/' + projectId + '/tasks/' + taskId + "/log")
    .reply(200
        ,"Hello World!");
}

test('task.log', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var task = project.tasks(taskId);

	task.log(function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj,"Hello World!");
		}
		else
		{
			t.ok(obj);
		}

    	t.end();
  	});
});