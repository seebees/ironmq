module.exports = function IronCacheProjects (headers, op) {
  op = op || {}
  op.api_version = op.api_version || '1'
  var transport = require('./transport')(
                  headers
                  , { protocol  : op.protocol || 'https'
                    , hostname  : op.host     || 'cache-aws-us-east-1.iron.io'
                    , pathname  : '/' + op.api_version})

  CacheProjects.projects  = CacheProjects

  return CacheProjects

  // Implementation

  function CacheProjects(project_id) {

    caches.id    = function () {return project_id}
    caches.caches = caches
    caches.list  = listCaches

    return caches

    // Implementation

    function caches(cache_name) {
      var path = '/projects/' + project_id
               + '/caches/'   + cache_name;

      var cache = {
          id  : function cacheId () {return cache_name}
        , put : cachePut
        , inc : cacheInc
        , get : cacheGet
        , del : cacheDelete
      }

      return cache;

      //Implementation

      /*
       *  op.expires_id
       *  op.replace
       *  op.add
      */
      function cachePut(key, value, op, cb) {

        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}
        op.body = value

        transport.put(path + "/items/" + key, op, cb)
      }

      function cacheInc(key,amount,cb) {
        // TODO type checking on amount
        var params = {amount: amount}

        transport.put(path + '/items/' + key + '/increment'
                    , params
                    , cb);
      }

      // TODO cacheDec

      function cacheGet(key,cb) {
        transport.get(path + '/items/' + key, null, cb)
      }

      function cacheDelete(key,cb) {
        transport.del(path + '/items/' + key, cb)
      }
    }

    /*
     * op.page etc
     * 
     */
    function listCaches(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      transport.get('/projects/' + project_id + '/caches'
                  , op
                  , function (err, obj) {
                      if (!err) {
                        obj = obj.map(function(cache) {
                          return caches(cache.name)
                        })
                      }

                      cb(err, obj)
                    })
    }
  }
}

