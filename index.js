var EventEmitter = require('events').EventEmitter
var ee = new EventEmitter()
var url = require('url')
var util = require('util');


module.exports = function (config) {
  // validate config
  if (!config.endpoint) throw new Error('endpoint required!') 
  if (!config.app) throw new Error('app required!') 

  var client1 = require('redis').createClient(
    url.parse(config.endpoint).port,
    url.parse(config.endpoint).hostname
  )

  var client2 = require('redis').createClient(
    url.parse(config.endpoint).port,
    url.parse(config.endpoint).hostname
  )

  client1.on("message", function (channel, message) {
    event = JSON.parse(message);
    if (event.to) ee.emit(event.to, event);
  });
  
  client1.subscribe(config.app);

  ee.on('send', function (event) {
    client2.publish(config.app, JSON.stringify(event))
  })
  return ee
}