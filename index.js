var EventEmitter = require('events').EventEmitter
var ee = new EventEmitter()
var url = require('url')
var redis = require('redis')


module.exports = function (config) {
  // validate config
  if (!config.endpoint) throw new Error('endpoint required!') 
  if (!config.app) throw new Error('app required!') 

  var client1 = redis.createClient(
    url.parse(config.endpoint).port,
    url.parse(config.endpoint).hostname
  )

  var client2 = redis.createClient(
    url.parse(config.endpoint).port,
    url.parse(config.endpoint).hostname
  )

  // subscribe
  client1.on("message", function (channel, message) {
    var event = JSON.parse(message);
    if (event.to) ee.emit(event.to, event);
  });
  
  client1.subscribe(config.app);

  // publish
  ee.on('send', function (event) {
    var stringifiedEvent = JSON.stringify(event);
    client2.publish(config.app, stringifiedEvent);
  })
  return ee
}