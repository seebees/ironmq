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
      '/1/projects/' + project + '/queues/' + q_name)
    .reply(200, {size:36})
}

test('queue.info', function(t) {
  ironmq(token)(project)(q_name).info(function(err, obj) {

    t.ok(obj.name(), q_name)
    t.ok(obj.size, 36)
    t.ok(obj.time, new Date())
    t.ok(typeof obj.get  === 'function')
    t.ok(typeof obj.put  === 'function')
    t.ok(typeof obj.del  === 'function')
    t.ok(typeof obj.info === 'function')

    t.end()
  })
})

