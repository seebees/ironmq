
var url     = require('url')
var request = require('request')
var qs      = require('querystring')

// Expose
module.exports = IronMQ

/**
 * Main entry point.  The whole implementation is
 * just currying token, project_id, queue_name inorder to
 * get, put, del messages
 *
 * token is the secret you will get from Iron.io
 *
 * op is an option object supporting
 * protocol
 * host
 * port
 * api_version
 *
 * These values are mostly for testing.  I have no idea
 * why you would want to change them in the real world.
 */
function IronMQ (token, op) {

  op = op || {}

  var headers = {
        'Authorization' : 'OAuth ' + token
      , 'Content-Type'  : 'application/json'
      , 'User-Agent'    : 'IronMQ Node Client'}

  var api_ver = op.ver || '1'

  var baseUrl = url.format({
        protocol  : op.protocol || 'https'
      , hostname  : op.host     || 'mq-aws-us-east-1.iron.io'
      , port      : op.port     || 443
      , pathname  : '/' + api_ver})

  /**
   *  Curry the project_id
  */
  function projects(project_id) {

    /**
     *  Curry the queue_name
     *  cb is a function.  Passing it is short hand for
     *  queues(q_name).info(cb)
     */
    function queues(queue_name, cb) {

      // path to use for http message operations
      var path = '/projects/' + project_id
               + '/queues/'     + queue_name
               + '/messages'

      // object to return
      var queue = {
            put   : messagePut
          , get   : messageGet
          , del   : messageDel
          , info  : queueInfo
          , name  : function(){return queue_name}}

      if (typeof cb === 'function') {
        queue.info(cb)
      }

      return queue

      //Implementation

      function messagePut(payload, op, cb) {

        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        var msgs
        if (Array.isArray(payload)) {
          var params = Object.keys(op)
            , l = params.length

          msgs = payload.map(function (msg) {
                              var ret = {}
                              // No Object.create love, JSON.strigify
                              // does not care for prototype properties
                              for (var i = 0; i<l; i++) {
                                ret[params[i]] = op[params[i]]
                              }
                              ret.body = msg
                              return ret
                            })
        } else {
          op.body = payload
          msgs = [op]
        }

        ironmqPut(path, {messages:msgs}, cb)
      }

      function messageGet(message_id, cb) {
        //paramater checking, return message w/ .del()
        var params = {}
        var msg_path = ''
        if (typeof message_id === 'function') {
          cb = message_id
        } else if (typeof message_id === 'number') {
          params.n = message_id
        } else if (typeof message_id === 'string') {
          msg_path = '/' + message_id
        } else {
          //error
        }
        ironmqGet(path + msg_path
                , params
                , function (err, obj) {
                    if (!err) {
                        obj = obj.messages.map(function(msg) {
                        msg.del = messageDel.bind(msg, msg.message_id)
                        return msg
                      })
                    }
                    cb(err, obj)
                })
      }

      function messageDel(message_id, cb) {
        ironmqDel(path + '/' + message_id, cb)
      }

      function queueInfo(cb) {
        var queuePath = '/projects/' + project_id
                      + '/queues/'   + queue_name
        // This will update the one you have.  Is this bad?
        ironmqGet(queuePath
                , {}
                , function (err, obj) {
                    queue.size = obj.size
                    queue.time = new Date()
                    cb(err, queue)
                })

        return queue
      }
    }

    /**
     *  Returns a array of queues for a given project
     */
    queues.list = function listQueues(op, cb) {
      if (typeof op === 'function') {
        cb = op
      }

      ironmqGet('/projects/' + project_id + '/queues'
              , {}
              , function(err, obj) {
                  if (!err) {
                    obj = obj.map(function(queue) {
                                    var tmp = queues(queue.name)
                                    tmp.Timestamper = queue.Timestamper
                                    return tmp
                                  })
                  }
                  cb(err, obj)
              })
    }
    queues.id = function(){return project_id}

    // little sugar
    queues.queues = queues

    return queues
  }

  /*
   *  Returns an array of projects for a given token
   */
  projects.list = function listProjects(cb) {
    if (api_ver > 1) {
      ironmqGet('/projects'
              , {}
              , function(err, obj) {
                  cb(err, obj)
              })
    } else {
      IronMQ(token
          , { ver: 2
            , host: 'worker-aws-us-east-1.iron.io'})
        .list(function(err, obj) {
          if (!err) {
            obj = obj.projects.map(function(project) {
              return IronMQ(token)(project.id)
            })
          }

          cb(err, obj)
        })
    }
  }

  // little sugar
  projects.projects = projects

  return projects


  //Transport implementation

  function ironmqGet(path, params, cb) {

    var search = qs.stringify(params)
    search = search ? ('?' + search) : ''

    request.get({ url     : baseUrl + path + search
                , headers : headers}
              , parseResponse(cb))
      .end()
  }

  function ironmqPut(path, body, cb) {
    request.post({ url    : baseUrl + path
                 , headers : headers}
              , parseResponse(cb))
      .end(JSON.stringify(body))
  }

  function ironmqDel(path, cb) {
    request.del({ url     : baseUrl + path
                , headers : headers}
              , parseResponse(cb))
      .end()
  }
}

/**
 *  one function to handle all the return errors
 */
function parseResponse(cb) {
  return function parse(err, response, body) {
    // TODO Handel the errors
    cb(err, JSON.parse(body))
  }
}

