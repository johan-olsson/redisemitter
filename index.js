'use strict'

const redis = require('redis')
const divider = ':'

module.exports = class RedisEmitter {

  constructor(options = {}) {

    this.options = Object.assign({
      port: 6379,
      host: '127.0.0.1',
      query: {
        type: '*',
        action: '*',
        name: '*',
        id: '*'
      }
    }, options)

    this.subscriptions = {}
    this.outstream = redis.createClient(this.options)
    this.instream = redis.createClient(this.options)
  }

  on(query, callback) {

    const handler = (pattern, event, payload) => {
      payload = JSON.parse(payload)
      if (pattern === query) callback(payload)
    }

    const subscriptionHandler = (err, pattern) => {
      if (err) console.error(err)
    }

    query = Object.assign({},
      this.options.query, query)


  query = Object.keys(this.options.query)
    .map((key) => query[key])
    .join(divider)

  if (!this.subscriptions[query]) {
    this.subscriptions[query] = 1
    this.instream.psubscribe(query, subscriptionHandler)
  } else this.subscriptions[query] += 1;

  this.instream.on('pmessage', handler)

  return (callback) => {
    this.instream.removeListener('pmessage', handler)

    if (!(this.subscriptions[query] -= 1))
      this.instream.punsubscribe(query, subscriptionHandler)
  }
}

once(query, callback) {
  const dispose = this.on(query, (message) => {
    callback(message)
    dispose()
  })

  return dispose
}

any(callback) {
  return this.on({}, callback)
}

emit(message) {

  this.outstream.publish(Object.keys(this.options.query)
    .map((key) => message[key])
    .join(divider), JSON.stringify(message))

  return this
}

quit() {
  this.instream.quit()
  this.outstream.quit()
}

end() {
  this.instream.quit()
  this.outstream.quit()
}
}