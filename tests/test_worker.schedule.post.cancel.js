var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token    	= con.token
var projectId 	= con.projectId
var taskId  	= con.taskId

if (con.proxy) {
	var req = nock(con.worker_url)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.user_agent)
		.post(
		'/2/projects/' + projectId + '/schedules/' + taskId + "/cancel")
		.reply(200
		, {
			msg : "Cancelled"
		},{
		   "content-type" : 'application/json'
	   })
}

test('scheduledTask.cancel(func)', function(t) {
	var client = iron(token).worker
	var project  = client.projects(projectId)
	var scheduledTask = project.schedules(taskId)

	scheduledTask.cancel(function(err, obj) {
		t.deepEqual(obj, {msg: 'Cancelled'})
		t.end()
	})
})
