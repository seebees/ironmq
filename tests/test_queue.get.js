var ironmq  = require('../')

var nock    = require('nock')
var assert  = require('assert')

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var queue   = con.queue

if (con.proxy) {
  var test = nock('https://mq-aws-us-east-1.iron.io')
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent','IronMQ Node Client')
    .get(
      '/1/projects/' + project + '/queues/' + queue
        + '/messages/4f1752cd52549a7435005a6b')
    .reply(200
      , { body: 'this is a test'
        , id: '4f1752cd52549a7435005a6b'
        , messages: [{ id: '4f1752cd52549a7435005a6b'
                     , timeout: 60
                     , body: 'this is a test'}]
        , timeout: 60 })
}

var client = ironmq(token)
var queue  = client
              .projects(project)
              .queues('my_queue')

queue.get('4f1752cd52549a7435005a6b'
        , function(err, obj) {
            assert.deepEqual(obj
                          , [{ id: '4f1752cd52549a7435005a6b'
                             , timeout: 60
                             , body: 'this is a test'
                             , del: obj[0].del}])
})


//TODO
// 1, cb
// '1', cb (will not work, real message id's parseInt into a number :(
// 3, cb
// cb
// msg_id not exist, cb  //{ msg: 'Method not allowed', status_code: 405 }
// # more then in queue, cb
// 5 when 0 in queue, cb
// [], cb
// {}, cb
// cb not a function
