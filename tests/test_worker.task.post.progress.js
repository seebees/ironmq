var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token    	= con.token
var projectId 	= con.project
var taskId  	= con.task

if (con.proxy) {
	var req = nock(con.worker_url)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.user_agent)
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
	   })
}

test('task.progress(int,msg,func)', function(t) {
	var client = iron(token).worker
	var project  = client.projects(projectId)
	var task = project.tasks(taskId)

	task.progress(25,"test message",function(err, obj) {
		t.deepEqual(obj, { msg: "Progress Set"})
		t.end()
	})
})
