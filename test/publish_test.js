var test = require('tap').test
var rewire = require('rewire')
var palmetto = rewire('../')

test('publish', function (t) {

  var fbMock = {
    createClient: function () {
      return {
        on: function() {

        },
        subscribe: function() {

        },
        publish: function(app, stringifiedEvent) {
          t.deepEquals(stringifiedEvent, {
            'to': 'beep',
            'from': 'boop',
            'subject': 'widget',
            'verb': 'create',
            'object': {
              'data': 'goes here'
            }
          })
        }
      }
    }
  }

  palmetto.__set__('redis', fbMock )

  var ee = palmetto({
    endpoint: 'http://localhost:6379/',
    app: 'widget'
  })

  ee.emit('send', {
    to: 'beep',
    from: 'boop',
    subject: 'widget',
    verb: 'create',
    object: { data: 'goes here'}
  })
  
  t.end()
  
})
