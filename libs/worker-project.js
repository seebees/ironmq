module.exports = function IronWorkerProjects(headers, op) {
  op = op || {}
  // worker is ONLY api_ver 2?
  op.api_version = op.api_version || '2'
  var transport = require('./transport')(
                  headers
                  , { protocol  : op.protocol || 'https'
                    , hostname  : op.host     || 'worker-aws-us-east-1.iron.io'
                    //, port      : op.port     || 443
                    , pathname  : '/' + op.api_version})

  WorkerProjects.list     = listProjects
  WorkerProjects.projects = WorkerProjects

  return WorkerProjects

  // Implementation

  function WorkerProjects(project_id) {
    var path  = '/projects/' + project_id

    tasks.list = listTasks
    codePackages.list = listCodePackages
    scheduledTasks.list = listSchedules

    var project = {
        id: function () { return project_id }
      , tasks: tasks
      , schedules: scheduledTasks
      , code: codePackages
    }

    return project

    // Implementation
    function tasks(task_id, cb) {
      var path = '/projects/' + project_id
               + '/tasks/'    + task_id

      var task = {
        id:      function () { return task_id; },
        info:    taskInfo,
        log:     taskLog,
        cancel:  taskCancel,
        progress:taskProgress
      }

      if (typeof cb === 'function') {
        task.info(cb)
      }

      return task

      //Implementation

      function taskInfo(cb) { transport.get(path, cb) }
      function taskLog(cb) { transport.get(path + '/log', cb) }
      function taskCancel(cb) { transport.post(path + '/cancel', null, cb) }

      function taskProgress(percent, msg, cb) {
        var progress = {
          percent: percent,
          msg: msg
        }

        transport.post(path + '/progress', progress, cb)
      }
    }

     /*
     *  op.page
     *  op.per_page
     *  op.from_time
     *  op.to_time
     */
    function listTasks(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      transport.get(url, params, function (err, obj) {
        if (!err) {
          obj = obj.tasks.map(function(task) {
            return tasks(task.id)
          })
        }

        cb(err, obj)
      })
    }

    function scheduledTasks(schedule_id, cb) {
      var path = '/projects/'  + project_id
               + '/schedules/' + schedule_id

      var schedule = {
        id:      function () {return schedule_id},
        info:    scheduleInfo,
        cancel:  scheduleCancel
      }

      if (typeof cb === 'function') {
        schedule.info(cb)
      }

      return schedule

      //Implementation
      function scheduleInfo(cb) { transport.get(path, cb) }

      function scheduleCancel(cb) { transport.post(path + '/cancel', cb) }
    }

    /*
     *  op.page
     *  op.per_page
     */
    function listSchedules(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      transport.get(path + '/schedules', op, function (err, obj) {
        if (!err)
        {
          obj = obj.schedules.map(function(schedule) {
            return scheduledTasks(schedule.id)
          })
        }

        cb(err, obj)
      })
    }

    function codePackages(code_id, cb) {
      var path = '/projects/' + project_id
               + '/codes/' + code_id

      var codePackage = {
          id        : function id() { return code_id; }
        , info      : codePackageInfo
        , del       : codePackageDelete
        , download  : codePackageDownload
        , revisions : codePackageRevisions
        , queue     : queueCodePackage
        , schedule  : scheduleCodePackage
        //, hook      : hookCodePackage // TODO
      }

      if (typeof cb === 'function') {
        codePackage.info(cb)
      }

      return codePackage

      //Implementation
      function codePackageInfo(cb) {transport.get(path, cb)}
      function codePackageDelete(cb) {transport.del(path, cb)}
      function codePackageDownload(cb) {transport.get(path + '/download', cb)}

      function queueCodePackage(payload, op, cb) {
        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}

        op.code_name  = code_name
        op.payload    = op.payload

        transport.post(path + '/tasks', {tasks:[op]}, cb);
      }

      function scheduleCodePackage(payload, op, cb) {
        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}

        op.code_name = ''
        op.payload   = payload

        transport.post(path + '/schedules'
                    , {schedules: [op]}
                    , cb)
      }

      function hookCodePackage(payload, op, cb) {

      }

      /*
       *  op.page
       *  op.per_page
       */
      function codePackageRevisions(op, cb) {
        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}

        transport.get(path + '/revisions', op, function (err, obj) {
          if (!err) {
            obj = obj.revisions
          }

          cb(err, obj)
        })
      }
    }

    function listCodePackages(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      transport.get(path + '/codes'
                  , op
                  , function (err, obj) {
                    if (!err) {
                      obj = obj.codes.map(function(codePackage) {
                        return codePackages(codePackage.id)
                      })
                    }

                    cb(err, obj)
                  })
    }
  }

  function listProjects(cb) {
    transport.get('/projects'
      , function (err, obj) {
        if (!err) {
          obj = obj.projects.map(function(project) {
            return WorkerProjects(project.id)
          })
        }

        cb(err, obj)
      })
  }
}
