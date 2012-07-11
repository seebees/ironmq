
var url     = require('url')
var request = require('request')
var qs      = require('querystring')

//Transport implementation

module.exports = function transport(headers, op) {
  var baseUrl = url.format(op)

  return { get: ironGet
         , put: ironPut
         , del: ironDel }

  function ironGet(path, params, cb) {
    var search = qs.stringify(params)
    search = search ? ('?' + search) : ''

    request.get({ url     : baseUrl + path + search
                , headers : headers}
              , parseResponse(cb))
      .end()
  }

  function ironPut(path, body, cb) {
    request.post({ url    : baseUrl + path
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

