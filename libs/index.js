// Expose
module.exports = Iron

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
function Iron (token, op) {

  op = op || {}
  op.ver =  op.ver || '1'

  var headers = {
        'Authorization' : 'OAuth ' + token
      , 'Content-Type'  : 'application/json'
      , 'User-Agent'    : 'Iron Node Client'}

  // little sugar
  project.project = project
  project.mq = function(project_id) {
    return require('./mq-project.js')(headers, op)
            .project(project_id)
  }
  project.cache = function(project_id) {
    return require('./cache-project.js')(headers, op)
            .project(project_id)
  }
  project.worker = function(project_id) {
    return require('./worker-project.js')(headers, op)
            .project(project_id)
  }

  return project

  /**
   *  Curry the project_id
  */
  function project(project_id, type) {
    switch (type) {
      case 'mq':
        return project.mq(project_id)
      case 'cache':
        return project.cache(project_id)
      case 'worker':
        return project.worker(project_id)
      default:
        return project.mq(project_id)
    }
  }
}

