IronMQ Node Client
-------------

Getting Started
==============

Install:

    npm install ironmq

You can get your `token` and `project_id` at http://www.iron.io .
Queues are created on the fly as you ask for them.

The Basics
=========

**Put** a message on a queue:

    var ironmq = require('ironmq')
    ironmq('token')
      .projects('project_id')
      .queues('my_queue')
      .put('hello world'
          , function callBack(err, obj) {
              obj.ids // array of ids posted
          })

**Get** a message from a queue:

    var ironmq = require('ironmq')
    ironmq('token')
      .projects('project_id')
      .queues('my_queue')
      .get(function callBack(err, msgs) {
              msgs    //array of msgs gotten
              var msg = msgs.pop()
              msg.id      // id of message
              msg.body    // message data
              msg.timeout // time until msg returns to queue
              msg.del     // function to delete this message
          })

When you pop/get a message from the queue, it will NOT be deleted. It will eventually go back onto the queue after
a timeout if you don't delete it (default timeout is 10 minutes).

**Delete** a message from a queue:

    var ironmq = require('ironmq')
    ironmq('token')
      .projects('project_id')
      .queues('my_queue')
      .del('message_id'
          , function callBack(err, obj) {
              obj.msg === 'Deleted'
          })

Delete a message from the queue when you're done with it.

Project Selection
===============

    // list projects
    var ironmq = require('ironmq')
    ironmq('token').list(function(err, obj) {
      obj  // array of project objects
    })

    var client  = ironmq('token')
    var project = client('project_id')

    var project = ironmq('token').projects('project_id')

    var project = ironmq('token')('project_id')

Queue Selection
===============

Similar to project selection, any of the following:

1. `project.list(function(err, obj){}` to get an array of queues
1. `var queue = project.queues('my_queue')`
1. `var queue = project('mq_queue')`

Queue Information
=================

    queue.info(function(err, obj) {
      obj.size    // number of msg's in this queue
      obj.time    // new Date when this size was gotten
      obj.get     // get messages from this queue
      obj.put     // put messages on this queue
      obj.del     // delete messages from this queue
      obj.info    // update the size property for this queue
    })

    project.queues('my_queue', function(err, queue) {})

    project('my_queue', function(err, queue) {})
