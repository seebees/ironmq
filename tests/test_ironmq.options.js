var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var proj_id = con.project
var q_name  = con.q_name

if (con.proxy) {
  var req = nock('http://host.name')
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent','IronMQ Node Client')
    .get(
      '/3/projects/' + proj_id + '/queues')
    .reply(200
        ,[{ Timestamper   : {updated_at: 1327083607064000000 }
          , project_id    : 'test_worked'
          , name          : 'test_worked'}])
}


test('ironmq.options', function(t) {
  ironmq(token
      ,{host      : 'host.name'
      , protocol  : 'http'
      , ver       : 3})(proj_id)
    .list(function(err, obj) {

      t.equal(obj[0].name(), 'test_worked')
      t.end()
    })

})

