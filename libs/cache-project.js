module.exports = function IronCacheProjects (headers, op) {

  var transport = require('./transport')(
                  headers
                  , { protocol  : op.protocol || 'https'
                    , hostname  : op.host     || 'cache-aws-us-east-1.iron.io'
                    , pathname  : '/' + op.ver})

  CacheProject.project = CacheProject

  return CacheProject

  // Implementation

  function CacheProject(project_id) {

    cache.id    = function () {return project_id}
    cache.cache = cache
    cache.list  = listCaches

    return cache

    // Implementation

    function cache(cache_name) {
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
        var params = {
          amount: amount
        }

        transport.put(path + '/items/' + key + '/increment', params, cb);
      }

      // TODO cacheDec

      function cacheGet(key,cb) {
        transport.get(path + '/items/' + key, null, cb)
      }

      function cacheDelete(key,cb) {
        transport.del(path + '/items/' + key, cb)
      }
    }

    function listCaches(pageIndex, cb) {
      if (typeof pageIndex === 'function') {
        cb = pageIndex
        pageIndex = null
      }

      if (pageIndex !== null) {
        params.page = pageIndex
      }

      transport.get('/projects/' + project_id + '/caches/'
                  , params
                  , function (err, obj) {
                      if (!err) {
                        obj = obj.map(function(cache) {
                          return cache(cache.name)
                        })
                      }

                      cb(err, obj)
                    })
    }
  }
}

