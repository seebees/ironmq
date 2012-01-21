var ironmq  = require('../')

var nock    = require('nock')
var assert  = require('assert')

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var queue   = con.queue

//TODO error when !project or typeof project !== 'string'
var client  = ironmq(token)
var project = client(project)
var queue   = project(queue)

assert(queue)
assert(typeof queue.get  === 'function')
assert(typeof queue.put  === 'function')
assert(typeof queue.del  === 'function')
assert(typeof queue.info === 'function')


//TODo
// queues.list()
// []
// {}
// cb
