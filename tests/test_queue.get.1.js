var ironmq  = require('../')

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
    .matchHeader('user-agent','IronMQ Node Client')
    .get(
      '/1/projects/' + project + '/queues/' + q_name
        + '/messages?n=1')
    .reply(200
      , { body: 'this is a test'
        , id: '4f1752cd52549a7435005a6b'
        , messages: [{ id: '4f1752cd52549a7435005a6b'
                     , timeout: 60
                     , body: 'this is a test'}]
        , timeout: 60 })
}

test('queue.get', function(t) {

  var queue = ironmq(token)
                .projects(project)
                .queues(q_name)

  queue.get(1
          , function(err, obj) {
              t.deepEqual(obj
                          , [{id: '4f1752cd52549a7435005a6b'
                            , timeout: 60
                            , body: 'this is a test'
                            , del: obj[0].del}])

    t.end()
  })
})

