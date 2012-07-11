module.exports = function IronWorkerProjects(headers, op) {
  var transport = require('./transport')(
                  headers
                  , { protocol  : op.protocol || 'https'
                    , hostname  : op.host     || 'worker-aws-us-east-1.iron.io'
                    , port      : op.port     || 443
                    , pathname  : '/' + op.ver})

  WorkerProjects.list    = listProjects
  WorkerProjects.project = WorkerProjects

  // worker is ONLY api_ver 2?
  return WorkerProjects

  // Implementation

  function WorkerProjects(project_id) {
    var path  = '/projects/' + project_id

    var tasksPath = path + '/tasks';
    var scheduledTasksPath = path + '/schedules';
    var codePackagesPath = path + '/codes';

    var project = {
      id: function () { return project_id; },

      // tasks
      listTasks: listTasks,
      queueTask: queueTask,
      hookTask: hookTask,
      tasks: tasks,

      // scheduled tasks
      listScheduledTasks: listScheduledTasks,
      scheduleTask: scheduleTask,
      scheduledTasks: scheduledTasks,

      // code packages
      listCodePackages: listCodePackages,
      codePackages: codePackages
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

      function taskInfo(cb) {
        ironWorkerGet(path, null, cb)
      }

      function taskLog(cb) {
        ironWorkerGet(path + '/log', null, cb)
      }

      function taskCancel(cb) {
        ironWorkerPostSimple(path + '/cancel', null, cb);
      }

      function taskProgress(percent, msg, cb) {
        var progress = {
          percent: percent,
          msg: msg
        }

        ironWorkerPost(path + '/progress', progress, cb)
      }
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
      function scheduleInfo(cb) {
        ironWorkerGet(path, null, cb)
      }

      function scheduleCancel(cb) {
        ironWorkerPostSimple(path + '/cancel', null, cb)
      }
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
      }

      if (typeof cb === 'function') {
        codePackage.info(cb)
      }

      return codePackage

      //Implementation
      function codePackageInfo(cb) {
        ironWorkerGet(path, null, cb)
      }

      function codePackageDelete(cb) {
        ironWorkerDel(path, cb)
      }

      function codePackageDownload(cb) {
        ironWorkerGet(path + '/download', null, cb);
      }

      function queueCodePackage(payload, op, cb) {
        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}

        op.code_name  = code_name
        op.payload    = op.payload

        ironWorkerPost(path + '/tasks', {tasks:[op]}, cb);
      }

      function scheduleCodePackage(payload, op, cb) {
        if (typeof op === 'function') {
          cb = op
          op = {}
        }

        op = op || {}

        op.code_name = ''
        op.payload   = payload

        ironWorkerPost('/projects/' + project_id + '/schedules'
                    , {schedules: [op]}
                    , cb)
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

        ironWorkerGet(path + '/revisions', params, function (err, obj) {
          if (!err) {
            obj = obj.revisions
          }

          cb(err, obj)
        })
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

      ironWorkerGet(url, params, function (err, obj) {
        if (!err) {
          obj = obj.tasks.map(function(task) {
            return tasks(task.id)
          })
        }

        cb(err, obj)
      })
    }

    /*
     *  op.priority
     *  op.timeout
     *  op.delay
     */
    function queueTask(code_name, payload, op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      op.code_name  = code_name
      op.payload    = op.payload

      ironWorkerPost(path + '/tasks', {tasks:[op]}, cb);
    }

    function hookTask(codeName, payload, cb) {
      var url = tasksPath + "/webhook?code_name=" + codeName

      ironWorkerPostSimple(url, payload, cb)
    }

    /*
     *  op.page
     *  op.per_page
     */
    function listScheduledTasks(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      ironWorkerGet(path + '', op, function (err, obj) {
        if (!err)
        {
          obj = obj.schedules.map(function(schedule) {
            return scheduledTasks(schedule.id)
          })
        }

        cb(err, obj);
      });
    }

    function scheduleTask(codeName, payload, properties, cb) {
      if (typeof properties === 'function') {
        cb = properties
        properties = null
      }

      var url = scheduledTasksPath;
      var schedule = {
        "code_name": codeName,
        "payload": payload
      }

      // merge in extra provided params
      if (properties !== null) {
        var keys = Object.keys(properties)
        var numKeys = keys.length

        for (var i = 0; i<numKeys; i++) {
          schedule[keys[i]] = properties[keys[i]]
        }
      }

      var params = {
        "schedules" : [schedule]
      }

      ironWorkerPost(url, params, cb)
    }

    function listCodePackages(op, cb) {
      if (typeof op === 'function') {
        cb = op
        op = {}
      }

      op = op || {}

      ironWorkerGet(url, op, function (err, obj) {
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
    ironWorkerGet('/projects'
      , {}
      , function (err, obj) {
        if (!err) {
          obj = obj.projects.map(function(project) {
            return IronWorker(token).projects(project.id);
          })
        }

        cb(err, obj)
      })
  }
}
