var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var q_name  = con.queue

test('queues', function(t) {
  //TODO error when !project or typeof project !== 'string'
  var client  = ironmq(token)
  var project = client.projects(project)
  var queue  = project(queue)

  t.ok(queue)
  t.ok(typeof queue.get  === 'function')
  t.ok(typeof queue.put  === 'function')
  t.ok(typeof queue.del  === 'function')
  t.ok(typeof queue.info === 'function')

  t.end()
})

if (con.proxy) {
  var req = nock('https://mq-aws-us-east-1.iron.io')
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent','IronMQ Node Client')
    .get(
      '/1/projects/' + project + '/queues')
    .reply(200
        ,[{ Timestamper   : {updated_at: 1327083607064000000 }
          , project_id    : '4e25e1d35c0dd2780100048d'
          , name          : 'my_queue'}])
}

test('queues.list', function(t) {

  var queue = ironmq(token)(project)(q_name)

  ironmq(token)(project).list(function(err, obj) {

    t.equal(obj.length, 1)
    t.equal(obj[0].name(), q_name)
    t.ok(typeof obj[0].get  === 'function')
    t.ok(typeof obj[0].put  === 'function')
    t.ok(typeof obj[0].del  === 'function')
    t.ok(typeof obj[0].info === 'function')

    t.deepEqual(obj[0].Timestamper,
                {updated_at: 1327083607064000000})
    t.end()
  })
})

//TODO
// []
// {}
// cb
