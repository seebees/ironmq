var ironmq  = require('../')

var nock    = require('nock')
var assert  = require('assert')

var con     = require('./constants.js')
var token   = con.token
var project = con.project

var client  = ironmq(token)
var project = client(project)
assert(project)
assert(typeof projects.queues === 'function')
assert(typeof projects.queues.list === 'function')

//TODO tests projects.list
//
// no project throw error
