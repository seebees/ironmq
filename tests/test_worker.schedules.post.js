var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token    	= con.token
var projectId 	= con.projectId
var taskId  	= con.taskId

if (con.proxy)
{
	var req = nock(con.worker_url)
		.matchHeader('authorization','OAuth ' + token)
		.matchHeader('content-type','application/json')
		.matchHeader('user-agent',con.user_agent)
		.post('/2/projects/' + projectId + '/schedules'
        , { schedules : [{
              'code_name': 'testCode'
            ,	'payload': 'testPayload'}]})
		.reply(200
        , {	msg : "Scheduled"
          ,	schedules: [{ 'id': taskId}]}
        , { 'content-type' : 'application/json'})
}

test('scheduledTasks.post(str,str,{},func)', function(t) {
	var client = iron(token).worker
	var project  = client.projects(projectId)

	project.scheduleTask('testCode',"testPayload", function(err, obj) {
		t.deepEqual(obj, { msg: "Scheduled"
                     , schedules: [{id: taskId}]})
		t.end()
	})
})


//TODO
// msg, not object, cb -> throw error

