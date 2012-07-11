var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var q_name  = con.queue

if (con.proxy) {
  var req = nock('https://mq-aws-us-east-1.iron.io')
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent','Iron Node Client')
    .get(
      '/1/projects/' + project + '/queues/' + q_name
        + '/messages/4f1752cd52549a7435005a6b')
    .reply(200
      , { body: 'this is a test'
        , id: '4f1752cd52549a7435005a6b'
        , messages: [{ id: '4f1752cd52549a7435005a6b'
                     , timeout: 60
                     , body: 'this is a test'}]
        , timeout: 60 }
      , {'content-type':'application/json'})
}

test('queue.get', function(t) {

  var queue = iron(token)
                .projects(project)
                .queues(q_name)

  queue.get('4f1752cd52549a7435005a6b'
          , function(err, obj) {
              t.deepEqual(obj
                          , [{id: '4f1752cd52549a7435005a6b'
                            , timeout: 60
                            , body: 'this is a test'
                            , del: obj[0].del}])

    t.end()
  })
})

//TODO
// '1', cb (will not work, real message id's parseInt into a number :(
// msg_id not exist, cb  //{ msg: 'Method not allowed', status_code: 405 }
// # more then in queue, cb
// 5 when 0 in queue, cb
// [], cb
// {}, cb
// cb not a function
