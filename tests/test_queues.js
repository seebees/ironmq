var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var queue   = con.queue

test('queues', function(t) {
  //TODO error when !project or typeof project !== 'string'
  var client  = ironmq(token)
  var project = client.projects(project)
  var queue   = project(queue)

  t.ok(queue)
  t.ok(typeof queue.get  === 'function')
  t.ok(typeof queue.put  === 'function')
  t.ok(typeof queue.del  === 'function')
  t.ok(typeof queue.info === 'function')

  t.end()
})

//TODo
// queues.list()
// []
// {}
// cb
