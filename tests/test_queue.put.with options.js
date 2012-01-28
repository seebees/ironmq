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
    .post(
      '/1/projects/' + project + '/queues/' + q_name + '/messages'
      , {"messages" : [{some: 'option', body:"this is a test"}]})
    .reply(200
      , { ids: ['4f176348ef05202f74005bc6']
        , msg: 'Messages put on queue.' })
}


test('queue.put(str, {some:option}, func)', function(t) {

  var queue = ironmq(token)(project)(q_name)

  queue.put('this is a test', {some: 'option'}, function(err, obj) {
    t.deepEqual(obj,
                    { ids: ['4f176348ef05202f74005bc6']
                    , msg: 'Messages put on queue.'})
    t.end()
  })

})

