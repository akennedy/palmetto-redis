var test = require('tap').test
var rewire = require('rewire')
var palmetto = rewire('../')

test('publish', function (t) {

  var fbMock = {
    createClient: function () {
      return {
        on: function(s, fn) {
          t.equals(s, 'message')
          // should skip first event...
          setTimeout(function() {
            fn('widget', '{"foo":"bar"}')
          }, 50)
          // should handle second
          setTimeout(function() {
            fn('widget', '{"to":"widget/response/create"}')
          }, 100)       
        },
        subscribe: function(s) {
          t.equals(s, 'widget')
        },
        publish: function(app, stringifiedEvent) {}
      }
    }
  }

  palmetto.__set__('redis', fbMock )

  var ee = palmetto({
    endpoint: 'http://localhost:6379/',
    app: 'widget'
  })

  ee.on('widget/response/create', function (event) {
    t.deepEquals(event, { to: 'widget/response/create' }, 'received notification of event')
    t.end()
  })
  
})