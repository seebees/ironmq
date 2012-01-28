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
      , {"messages" : [ { body: 'this is a test' }
                      , { body: 'another test' }
                      , { body: 'one last test' }]})
    .reply(200
      , { ids: ['4f231f0fef05207255008f4a'
              , '4f231f0fef05207255008f4b'
              , '4f231f0fef05207255008f4c']
        , msg: 'Messages put on queue.' })
}


test('queue.put([], func)', function(t) {

  var client = ironmq(token)
  var queue  = client
                .projects(project)
                .queues(q_name)

  queue.put([
              'this is a test'
            , 'another test'
            , 'one last test']
          , function(err, obj) {
              t.deepEqual(obj
                        , { ids: ['4f231f0fef05207255008f4a'
                                , '4f231f0fef05207255008f4b'
                                , '4f231f0fef05207255008f4c']
                          , msg: 'Messages put on queue.'})
              t.end()
          })

})

