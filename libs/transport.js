
var url     = require('url')
var request = require('request')
var qs      = require('querystring')

//Transport implementation

module.exports = function transport(headers, op) {
  var baseUrl = url.format(op)

  return { get  : ironGet
         , post : ironPost
         , put  : ironPut
         , del  : ironDel }

  function ironGet(path, params, cb) {
    if (typeof params === 'function') {
      cb = params
      params = null
    }

    request.get({ url     : baseUrl
                            + url.format({pathname: path, query: params})
                , headers : headers}
              , parseResponse(cb))
      .end()
  }

  function ironPost(path, body, cb) {
    if (typeof body === 'function') {
      cb = body
      body = null
    }

    var send = body ? JSON.stringify(body) : ''

    request.post({ url    : baseUrl + path
                 , headers : headers}
              , parseResponse(cb))
      .end(send)
  }

  function ironPut(path, body, cb) {
    request.put({ url     : baseUrl + path
                , headers : headers}
              , parseResponse(cb))
      .end(JSON.stringify(body))
  }

  function ironDel(path, cb) {
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
    if (err) {
      cb(err, body)
    } else if (response.statusCode == '200') {
      var result
      if (response.headers['content-type'] == 'application/json') {
        result = JSON.parse(body)
      } else {
        result = body
      }

      cb(null, result)
    } else {
      cb(response.statusCode, body)
    }
  }
}

