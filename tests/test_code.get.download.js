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
    .get(
      '/2/projects/' + projectId + '/codes/' + codeId + "/download")
    .reply(200
        ,"test zip",{
		"content-disposition" : "filename=yourworker_rev.zip",
	  	"content-type" : 'application/zip'
	});
}

test('code.download', function(t)
{
	var client = ironWorker(token);
	var project = client.projects(projectId);
	var codePackage = project.codePackages(codeId);

	codePackage.download(function(err, obj)
	{
		t.ok(obj);

    	t.end();
  	});
});