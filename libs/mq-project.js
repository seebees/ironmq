
module.exports = function IronMQProjects(headers, op) {
  op = op || {}
  var api_ver = op.api_version = op.api_version || '1'
  var transport = require('./transport')(
                  headers
                  , { protocol  : op.protocol || 'https'
                    , hostname  : op.host     || 'mq-aws-us-east-1.iron.io'
                    , pathname  : '/' + op.api_version})

  // little sugar
  MQProjects.list    = listProjects
  MQProjects.projects = MQProjects

  return MQProjects

  function MQProjects(project_id) {

    // little sugar
    queues.id     = function(){return project_id}
    queues.queues = queues
    queues.list = listQueues

    return queues

    /**
     *  Curry the queue_name
     *  cb is a function.  Passing it is short hand for
     *  queues(q_name).info(cb)
     */
    function queues(queue_name, cb) {

      // path to use for http message operations
      var path = '/projects/' + project_id
               + '/queues/'   + queue_name
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

        transport.post(path, {messages:msgs}, cb)
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
        transport.get(path + msg_path
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
        transport.del(path + '/' + message_id, cb)
      }

      function queueInfo(cb) {
        var queuePath = '/projects/' + project_id
                      + '/queues/'   + queue_name
        // This will update the one you have.  Is this bad?
        transport.get(queuePath
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
    function listQueues(op, cb) {
      if (typeof op === 'function') {
        cb = op
      }

      transport.get('/projects/' + project_id + '/queues'
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
  }

  /*
   *  Returns an array of projects for a given token
   */
  function listProjects(cb) {
    if (api_ver > 1) {
      transport.get('/projects'
              , {}
              , function(err, obj) {
                  cb(err, obj)
              })
    } else {
      IronMQProjects(headers
          , {api_version: 2})
        .list(function(err, obj) {
          if (!err) {
            obj = obj.projects.map(function(project) {
              return MQProjects(project.id)
            })
          }

          cb(err, obj)
        })
    }
  }
}



