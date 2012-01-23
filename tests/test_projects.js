var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project

test('client', function(t) {
  t.ok(typeof ironmq === 'function')

  //TODO error when !token or typeof token !== 'string'
  var client = ironmq()
  t.ok(typeof client.projects === 'function')
  t.ok(typeof client.projects === 'function')
  t.ok(typeof client.projects.list === 'function')
  t.ok(client === client.projects)
  t.ok(client.list === client.projects.list)

  t.end()
})
//TODO how do I test options?  list?
//
// 'token'
// no token gives error
// 'token' {protocol:, host:, port:, ver:}


test('projects', function(t) {
  var projects  = ironmq(token)
  var project   = projects(project)
  t.ok(project)
  t.ok(typeof project.queues === 'function')
  t.ok(typeof project.queues.list === 'function')
  t.ok(project === project.queues)
  t.ok(project.list === project.queues.list)

  t.end()
})

//TODO tests projects.list
//
// no project throw error
