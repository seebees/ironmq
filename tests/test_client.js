var ironmq  = require('../')
var assert  = require('assert')

assert(typeof ironmq === 'function')

//TODO error when !token or typeof token !== 'string'
var client = ironmq()
assert(client)
assert(typeof client.projects === 'function')
assert(typeof client.projects.list === 'function')

//TODO how do I test options?  list?
//
// 'token'
// no token gives error
// 'token' {protocol:, host:, port:, ver:}
