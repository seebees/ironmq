var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var proj_id = con.project

test('worker', function(t) {
	var client  = iron(token)


  t.ok(typeof client.worker.list      === 'function')
	t.ok(typeof client.worker.projects  === 'function')

	var project = client.worker(proj_id)

  //t.ok(typeof project           === 'funciton')
	t.ok(typeof project.id        === 'function')
	t.ok(typeof project.schedules === 'function')
	t.ok(typeof project.code      === 'function')
	t.ok(typeof project.tasks     === 'function')

	t.equal(project.id(), proj_id)

	t.end()
})

if (con.proxy) {
	var req = nock(con.worker_url)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.user_agent)
		.get('/2/projects')
		.reply(200
        , {projects: [
            { id: proj_id
            , timestamps: { "created_at":1308800463000000000
            , "updated_at":1311105491000000000}
            , user_id: '4e25e1cf5c0dd2780100022a'
            , name: 'test'
            , type: 'free'
            , task_count: 0}
          ]
        }
        , {'content-type' : 'application/json'})
}

test('projects.list', function(t) {
	var client = iron(token);

	client.worker.list(function(err, obj) {
    t.equal(obj.length, 1)

    var project = obj[0]
    t.equal(project.id(), proj_id)

    t.ok(typeof project.id        === 'function')
    t.ok(typeof project.schedules === 'function')
    t.ok(typeof project.code      === 'function')
    t.ok(typeof project.tasks     === 'function')
		
		t.end()
	})
})

//TODO
// no project throw error?
