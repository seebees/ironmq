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
    .post(
      '/1/projects/' + project + '/queues/' + queue + '/messages'
      , {"messages" : [{body:"this is a test"}]})
    .reply(200
      , { ids: ['4f176348ef05202f74005bc6']
        , msg: 'Messages put on queue.' })
}

var client = ironmq(token)
var queue  = client
              .projects(project)
              .queues('my_queue')

queue.put('this is a test', {}, function(err, obj) {
  assert.deepEqual(obj,
                  { ids: ['4f176348ef05202f74005bc6']
                  , msg: 'Messages put on queue.'})
})


//TODO
// msg, cb
// msg, options, cb
// [msgs], cb


/*
var client = ironmq('mytoken')

client.get()
client.put()
client.del()

client.projects.list(page, page_size)

client.projects('my_project').messages('my_queue').put('my message', cb)
client.projects('my_project').messages('my_queue').del('message_id', cb)
client.projects('my_project').messages('my_queue').get(op, cb)

client.projects('my_project').messages('my_queue').get(op, cb).id
client.projects('my_project').messages('my_queue').get(op, cb).body
client.projects('my_project').messages('my_queue').get(op, cb).timeout
client.projects('my_project').messages('my_queue').get(op, cb).delay
client.projects('my_project').messages('my_queue').get(op, cb).expires_in
client.projects('my_project').messages('my_queue').get(op, cb).del()

client.projects('my_project').queues.list(page, page_size)

client.projects('my_project').queues('my_queue').id
client.projects('my_project').queues('my_queue').name
client.projects('my_project').queues('my_queue').size
client.projects('my_project').queues('my_queue').put('my message', cb)
client.projects('my_project').queues('my_queue').del('message_id', cb)
client.projects('my_project').queues('my_queue').get(op, cb)
client.projects('my_project').queues('my_queue').get(op, cb).body
client.projects('my_project').queues('my_queue').get(op, cb).timeout
client.projects('my_project').queues('my_queue').get(op, cb).delay
client.projects('my_project').queues('my_queue').get(op, cb).expires_in
client.projects('my_project').queues('my_queue').get(op, cb).del()






asdf.messages('my_queue').put('my message', cb)

*/
