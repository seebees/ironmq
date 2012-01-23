var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var queue   = con.queue

if (con.proxy) {
  var req = nock('https://mq-aws-us-east-1.iron.io')
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent','IronMQ Node Client')
    .delete(
      '/1/projects/' + project + '/queues/' + queue
        + '/messages/4f1752cd52549a7435005a6b')
    .reply(200
      , { msg: 'Deleted'})
}

test('queue.del', function(t) {

  var client = ironmq(token)
  var queue  = client
                .projects(project)
                .queues('my_queue')

  queue.del('4f1752cd52549a7435005a6b'
          , function(err, obj) {
              t.deepEqual(obj, { msg: 'Deleted'})
              t.end()
          })
})

//TODO
// id does not exist, cb
// [], cb
// {}, cb
//
// need to test where cb not a function
