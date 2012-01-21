
var url = require('url')
var request = require('request')

function IronMQ (token, op) {

  op = op || {}

  var headers = {
        'Authorization' : 'OAuth ' + token
      , 'Content-Type'  : 'application/json'
      , 'User-Agent'    : 'IronMQ Node Client'}

  var baseUrl = url.format({
        protocol  : op.protocol || 'https'
      , hostname  : op.host     || 'mq-aws-us-east-1.iron.io'
      , port      : op.port     || 443
      , pathname  : '/' + (op.ver || '1')})

  function projects(project_id) {

    function queues(queue_name, cb) {
      var path = '/projects/' + project_id
               + '/queues/'     + queue_name
               + '/messages'
      var queue = {
            put   : messagePut
          , get   : messageGet
          , del   : messageDel
          , info  : queueInfo}

      if (typeof cb === 'function') {
        queue.info(cb)
      } else {
        return queue
      }


      function messagePut(payload, op, cb) {

        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        var msgs
        if (Array.isArray(payload)) {
          msgs = payload
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
                  , {}
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
                      + '/queues/'     + queue_name
        // This will update the one you have.  Is this bad?
        ironmqGet(queuePath
                  , {}
                  , function (err, obj) {
                    queue.id   = obj.id
                    queue.name = obj.name
                    queue.size = obj.size
                    cb(err, queue)
                  })

      }
    }

    queues.list = function (op, cb) {

    }

    return {queues: queues}
  }

  projects.list = function(cb) {

  }

  return {projects: projects}


  //Transport implementation

  function ironmqGet(path, params, cb) {
    request({ url     : baseUrl + path + '' // params => qs
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

function parseResponse(cb) {
  return function parse(err, response, body) {
    cb(err, JSON.parse(body))
  }
}

module.exports = IronMQ
