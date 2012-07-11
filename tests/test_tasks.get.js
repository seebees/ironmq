var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var taskId    	= con.taskId;

test('task', function(t)
{
	//TODO error when !project or typeof project !== 'string'
	var client  = ironWorker(token);
  	var project = client.projects(projectId);
  	var task  = project.tasks(taskId);

 	t.ok(task);
	assertIsTask(t,task);

  	t.end();
});

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .get(
      '/2/projects/' + projectId + '/tasks?page=0&per_page=0')
    .reply(200
        ,{ tasks : [{ Timestamper   : {updated_at: 1327083607064000000 }
          , project_id    : projectId
          , id            : taskId}]
	  },{
	  	"content-type" : 'application/json'
	});
}

test('tasks.list', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);

	project.listTasks(0,0,function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), taskId);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var task = obj[i];

			assertIsTask(t,task);
		}

    	t.end();
  	});
});

function assertIsTask(t,task)
{
	t.ok(typeof task.id === 'function');
	t.ok(typeof task.info  === 'function');
	t.ok(typeof task.log  === 'function');
	t.ok(typeof task.cancel  === 'function');
	t.ok(typeof task.progress === 'function');
}

//TODO
// []
// {}
// cb
