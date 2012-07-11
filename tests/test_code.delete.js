var ironWorker  = require('../').IronWorker;

var nock    = require('nock');
var test    = require('tap').test;
var con     = require('./constants.js');

var token   	= con.token;
var projectId 	= con.projectId;
var codeId    	= con.codeId;

if (con.proxy)
{
  var req = nock('https://' + con.ironWorkerRootUrl)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.ironWorkerUserAgent)
    .delete(
      '/2/projects/' + projectId + '/codes/' + codeId)
    .reply(200
        ,{
		  "msg":"Deleted"
	  },{
	  	"content-type" : 'application/json'
	});
}

test('code.delete', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var codePackage = project.codePackages(codeId);

	codePackage.delete(function(err, obj)
	{
		t.deepEqual(obj,
					{
						msg: "Deleted"
					});
		t.end();
  	});
});