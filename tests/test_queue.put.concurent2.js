var ironmq  = require('../')

var nock    = require('nock')
var test    = require('tap').test

var con     = require('./constants.js')
var token   = con.token
var project = con.project
var q_name  = con.queue

var queue  = ironmq(token)
              .projects(project)
              .queues(q_name)

console.time('All requests sent')
console.time('First Resonse recived')
queue.put('first msg', {}, function(err, obj) {
  console.error('return from first')
  console.timeEnd('First Resonse recived')
})

console.error('sent first')

console.time('Second Resonse recived')
queue.put('second msg', {}, function(err, obj) {
  console.error('return from second')
  console.timeEnd('Second Resonse recived')
})

console.error('sent second')

console.time('Third Resonse recived')
queue.put('third msg', {}, function(err, obj) {
  console.error('return from third')
  console.timeEnd('Third Resonse recived')
})

console.time('fourth Resonse recived')
queue.put('forth msg', {}, function(err, obj) {
  console.error('return from fourth')
  console.timeEnd('forth Resonse recived')
})

console.error('sent fourth')

console.time('Fifth Resonse recived')
queue.put('fifth msg', {}, function(err, obj) {
  console.error('return from fifth')
  console.timeEnd('Fifth Resonse recived')
})

console.error('sent fifth')

console.time('Sixth Resonse recived')
queue.put('sixth msg', {}, function(err, obj) {
  console.error('return from sixth')
  console.timeEnd('Sixth Resonse recived')
})


console.error('sent sixth')
console.timeEnd('All requests sent')
