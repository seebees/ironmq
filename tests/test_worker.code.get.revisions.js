var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	= con.token
var projectId 	= con.project
var codeId    	= con.code

if (con.proxy) {
  var req = nock(con.worker_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .get(
      '/2/projects/' + projectId + '/codes/' + codeId + '/revisions')
    .reply(200
        , { revisions: [
            { id: '4f32d9c81cf75447be020ea6'
				    , code_id: codeId
				    , project_id: projectId
				    , rev: 1
				    , runtime: 'ruby'
				    , name: 'MyWorker'
				    , file_name: 'worker.rb'}
        ,   { id: '4f32da021cf75447be020ea8'
				    , code_id: codeId
				    , project_id: projectId
				    , rev: 2
				    , runtime: 'ruby'
				    , name: 'MyWorker'
				    , file_name:'worker.rb'}]}
        , {'content-type' : 'application/json'})
}

test('code.revisions', function(t) {
	var client = iron(token).worker
	var project = client.projects(projectId)
	var codePackage = project.code(codeId)

	codePackage.revisions(function(err, obj) {
		if (con.proxy) {
			t.equal(obj.length, 2);
			t.equal(obj[0].code_id, codeId);
			t.equal(obj[0].project_id, projectId);
			t.equal(obj[1].code_id, codeId);
			t.equal(obj[1].project_id, projectId);
		}

		;for (var i = 0; i < obj.length; i++) {
			assertIsRevision(t,obj[i])
		}

    	t.end()
  	})
})

function assertIsRevision(t,revision) {
	t.ok(revision.id)
	t.ok(revision.code_id)
	t.ok(revision.project_id)
	t.ok(revision.rev)
	t.ok(revision.runtime)
	t.ok(revision.name)
	t.ok(revision.file_name)
}

// TODO paginate
