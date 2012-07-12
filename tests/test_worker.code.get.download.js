var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	= con.token
var projectId 	= con.project
var codeId    	= con.codeId

if (con.proxy) {
  var req = nock(con.worker_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .get(
      '/2/projects/' + projectId + '/codes/' + codeId + "/download")
    .reply(200
        , "test zip"
        , { "content-disposition" : "filename=yourworker_rev.zip"
          , "content-type" : 'application/zip'})
}

test('code.download', function(t) {
	var client = iron(token).worker
	var project = client.projects(projectId)
	var codePackage = project.code(codeId)

	codePackage.download(function(err, obj) {
    t.ok(obj)
    t.end()
  })
})
