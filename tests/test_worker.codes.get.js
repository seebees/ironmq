var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test
var con     = require('./constants.js')

var token   	= con.token
var projectId 	= con.projectId
var codeId    	= con.codeId

test('task', function(t) {
	//TODO error when !project or typeof project !== 'string'
	var client  = iron(token).worker
  var project = client.projects(projectId)
  var codePackage  = project.code(codeId)

 	t.ok(codePackage)
	assertIsCodePackage(t,codePackage)

  	t.end()
});

if (con.proxy) {
  var req = nock(con.worker_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .get(
      '/2/projects/' + projectId + '/codes')
    .reply(200
        , { codes : [
			      { "id": codeId
  				  , "project_id": projectId
	  			  , "name": "MyWorker"
		  		  , "runtime": "ruby"
			  	  , "latest_checksum": "b4781a30fc3bd54e16b55d283588055a"
				    , "rev": 1
				    , "latest_history_id": "4f32ecb4f840063758022153"
  				  , "latest_change": 1328737460598000000}]}
        , {	"content-type" : 'application/json'})
}

test('codes.list', function(t) {
	var client = iron(token).worker
	var project = client.projects(projectId)

	project.code.list(function(err, obj) {
		if (con.proxy) {
			t.equal(obj.length, 1);
			t.equal(obj[0].id(), codeId);
		}

		;for (var i = 0; i < obj.length; i++) {
			var codePackage = obj[i]

			assertIsCodePackage(t,codePackage)
		}

    	t.end()
  	})
})

function assertIsCodePackage(t,codePackage) {
	t.ok(typeof codePackage.id        === 'function')
	t.ok(typeof codePackage.info      === 'function')
	t.ok(typeof codePackage.del       === 'function')
	t.ok(typeof codePackage.download  === 'function')
	t.ok(typeof codePackage.revisions === 'function')
  t.ok(typeof codePackage.queue     === 'function')
  t.ok(typeof codePackage.schedule  === 'function')
  //t.ok(typeof codePackage.hook      === 'function')
}

//TODO
// []
// {}
// cb
