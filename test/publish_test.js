var test = require('tap').test
var pr = require('../')

test('publish', function (t) {
  var ee = pr({ 
    endpoint: 'localhost:6379',
    app: 'foo'
  })
  ee.emit('send', { to: 'widget.request.create', name: 'foobar'})
  t.end()
})