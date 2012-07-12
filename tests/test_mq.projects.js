var iron  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var proj_id = con.project

test('client', function(t) {
  t.ok(typeof iron === 'function')

  var client = iron(token).mq
  t.ok(typeof client.projects === 'function')
  t.ok(typeof client.projects === 'function')
  t.ok(typeof client.projects.list === 'function')
  t.ok(client === client.projects)
  t.ok(client.list === client.projects.list)

  t.end()
})

test('projects', function(t) {
  var projects  = iron(token).mq
  var project   = projects(proj_id)
  t.ok(project)
  t.ok(typeof project.queues === 'function')
  t.ok(typeof project.queues.list === 'function')
  t.ok(project === project.queues)
  t.ok(project.list === project.queues.list)
  t.equal(project.id(), proj_id)

  t.end()
})

if (con.proxy) {
  var req = nock(con.mq_url)
    .matchHeader('authorization','OAuth ' + token)
    .matchHeader('content-type','application/json')
    .matchHeader('user-agent',con.user_agent)
    .get(
      '/2/projects')
    .reply(200
        ,{ projects: [{ id: '4e25e1d35c0dd2780100048d'
                      , timestamps: { "created_at":1308800463000000000
                                    , "updated_at":1311105491000000000}
                      , user_id: '4e25e1cf5c0dd2780100022a'
                      , name: 'test'
                      , type: 'free'
                      , task_count: 0 }]}
        ,{'content-type':'application/json'})
}


test('projects.list', function(t) {
  iron(token)
    .mq
    .list(function(err, obj) {
      t.equal(obj.length, 1)
      t.equal(obj[0].id(), proj_id)
      t.ok(typeof obj[0].list    === 'function')
      t.ok(typeof obj[0].queues  === 'function')

      t.end()
    })
})

//TODO
// no project throw error?
