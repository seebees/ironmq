var iron  = require('../')

var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var proj_id = con.projectId


test('iron', function(t) {
	t.ok(typeof iron === 'function')

	var client = iron(token)
  t.ok(typeof client          === 'function')
  t.ok(typeof client.projects === 'function')
  t.ok(typeof client.mq       === 'function')
  t.ok(typeof client.worker   === 'function')
  t.ok(typeof client.cache    === 'function')

	t.end()
})


//TODO error when !token or typeof token !== 'string'
