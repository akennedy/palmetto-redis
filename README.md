# Palmetto Redis

[![Build Status](https://travis-ci.org/akennedy/palmetto-redis.svg?branch=master)](https://travis-ci.org/akennedy/palmetto-redis)

This module uses redis as the pub/sub messaging component for palmetto flow applications

## usage

### configure

``` js
var io = require('@akennedy/palmetto-redis')({
  endpoint: 'http://localhost:6379',
  app: '<appname>'
})
```

### subscribe
``` js
io.on('foobar', function (msg) {
  console.log(msg)
})
```

### publish
``` js
io.emit('send', msg)
```

## common patterns

### frontend component query

``` js
var uuid = uuid.v4()
io.on(uuid, function (event) {
  console.log(event.object)
})
io.emit('send', {
  to: 'widget.all.request',
  from: uuid,
  subject: 'widget',
  verb: 'all',
  type: 'request',
  object: {}
})
```

### backend service

``` js
io.on('widget.all.request', function (event) {
  // do work
  var results = ...

  io.emit('send', {
    to: event.from,
    subject: 'widget',
    verb: 'all',
    type: 'response',
    object: results
  })
})
```

The service listens to the `widget.all.request` svc then uses the `from` node to publish the response to.