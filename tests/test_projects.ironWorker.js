var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;

var con     = require('./constants.js');
var token   = con.token;
var proj_id = con.projectId;

test('client', function(t)
{
	t.ok(typeof ironWorker === 'function');

	//TODO error when !token or typeof token !== 'string'
	var client = ironWorker();

	t.ok(typeof client.listProjects === 'function');
	t.ok(typeof client.projects === 'function');

	t.end();
});

test('project', function(t)
{
	var client  = ironWorker(token);
	var project = client.projects(proj_id);

	assertIsProject(t,project);
	t.equal(project.id(), proj_id);

	t.end();
});

if (con.proxy)
{
	var req = nock('https://' + con.ironWorkerRootUrl)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.ironWorkerUserAgent)
		.get(
			'/2/projects')
		.reply(200
		,{
			projects: [
				{
					id: '4e25e1d35c0dd2780100048d'
					, timestamps: { "created_at":1308800463000000000
					, "updated_at":1311105491000000000}
					, user_id: '4e25e1cf5c0dd2780100022a'
					, name: 'test'
					, type: 'free'
					, task_count: 0
				}
			]
		},
		{
			"content-type" : 'application/json'
		});
}

test('projects.list', function(t)
{
	var client = ironWorker(token);

	client.listProjects(function(err, obj)
	{
		if (con.proxy)
		{
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), proj_id);
		}

		for (var i = 0; i < obj.length; i++)
		{
			var project = obj[i];

			assertIsProject(t,project);
		}

		t.end();
	});
});

function assertIsProject(t,project)
{
	t.ok(project);
	t.ok(typeof project.id === 'function');
	t.ok(typeof project.listTasks === 'function');
	t.ok(typeof project.queueTask === 'function');
	t.ok(typeof project.hookTask === 'function');
	t.ok(typeof project.tasks === 'function');
}

//TODO
// no project throw error?
