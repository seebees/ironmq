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
module.exports = function Iron (token, op) {

  op = op || {}
  op.ver =  op.ver || '1'

  var headers = {
        'Authorization' : 'OAuth ' + token
      , 'Content-Type'  : 'application/json'
      , 'User-Agent'    : 'Iron Node Client'}

  // little sugar
  projects.projects = projects
  projects.mq       = require('./mq-project.js')(headers, op)
  projects.cache    = require('./cache-project.js')(headers, op)
  projects.worker   = require('./worker-project.js')(headers, op)

  return projects

  /**
   *  Curry the project_id
  */
  function projects(project_id, type) {
    switch (type) {
      case 'mq':
        return projects.mq(project_id)
      case 'cache':
        return projects.cache(project_id)
      case 'worker':
        return projects.worker(project_id)
      default:
        return projects.mq(project_id)
    }
  }
}

