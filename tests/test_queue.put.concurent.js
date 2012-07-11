var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var q_name  = con.queue

;(function() {
  var sendReceiveDelete;

  process.env.IRON_MQ_TOKEN = token;

  process.env.IRON_MQ_PROJECT_ID = project;

  sendReceiveDelete = function() {
    var mq, msg;
    mq = ironmq(process.env.IRON_MQ_TOKEN);
    mq = mq.projects(process.env.IRON_MQ_PROJECT_ID);
    mq = mq.queues('test');
    msg = "My lucky number is " + (Math.floor(Math.random() * 100000000)) + ".";

    console.error('Start PUT:' + msg)
    mq.put(msg, function(err, result) {
      console.error("SENT: " + msg)

      mq.get(function(err, result) {
        console.error("RECEIVEED: " + msg);

        if (result.length > 0) {
          mq.del(result[0].id, function(err, result) {
            console.error("DELED:" + msg)
            //return console.error("DELETE: " + (JSON.stringify(result)));
          });

        }

        process.nextTick(sendReceiveDelete);
      });

    });
  };

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

  sendReceiveDelete();

}).call(this);
