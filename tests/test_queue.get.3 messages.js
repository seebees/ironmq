var iron  = require('../')

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
    .matchHeader('user-agent','Iron Node Client')
    .get(
      '/1/projects/' + project + '/queues/' + q_name
        + '/messages?n=3')
    .reply(200
      , { messages: [{id: '4f17599852549a7435005c38'
                    , timeout: 60
                    , body: 'this is a test'}
                    ,{id: '4f1759baef05202f74005b02'
                    , timeout: 60
                    , body: 'this is a test' }
                    ,{id: '4f1759f5ef05202f74005b06'
                    , timeout: 60
                    , body: 'this is a test'}]}
      , {'content-type':'application/json'})
}

test('queue.get', function(t) {

  var queue = iron(token)
                .projects(project)
                .queues(q_name)

  queue.get(3
          , function(err, obj) {
              t.deepEqual(obj
                          , [{id: '4f17599852549a7435005c38'
                            , timeout: 60
                            , body: 'this is a test'
                            , del: obj[0].del}
                            ,{id: '4f1759baef05202f74005b02'
                            , timeout: 60
                            , body: 'this is a test'
                            , del: obj[1].del}
                            ,{id: '4f1759f5ef05202f74005b06'
                            , timeout: 60
                            , body: 'this is a test'
                            , del: obj[2].del
                          }])

    t.end()
  })
})


