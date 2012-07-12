var iron    = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	  = con.token
var projectId   = con.project
var codeId    	= con.code

if (con.proxy) {
  var req = nock(con.worker_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .delete(
      '/2/projects/' + projectId + '/codes/' + codeId)
    .reply(200
        ,{"msg":"Deleted"}
        ,{"content-type" : 'application/json'})
}

test('code.delete', function(t) {
	var client = iron(token).worker
	var project = client.projects(projectId)
	var codePackage = project.code(codeId)

	codePackage.del(function(err, obj) {
		t.deepEqual(obj,{msg: "Deleted"})
		t.end()
  })
})
