# RedisEmitter


## Install and test
```bash
npm install --save redisemitter
npm test
```

<hr>

### Setup
```javascript
const RedisEmitter = require('redisemitter')

const options = {
  host: 'localhost',
  port: 6379,
  index: ['type', 'action', 'name', 'id']
}
const events = new RedisEmitter(options)
```

#### options
* **host** _the host redis should connect to._
  * default: `'127.0.0.1'`
* **port** _the port redis should connect to._
  * default: `6379`
* **query** _the default query all event strings will be generated from._
  * default: `['type', 'action', 'name', 'id']`

<hr>

### Emitting events
emit only takes one argument and the event pattern will be built from the message. In this case `event:emit:*:*`
```javascript
events.emit({
  type: 'event',
  action: 'emit'
})
```
<hr>

### Subscribing to events

Unlike EventEmitter you subscribe to objects instead of strings (a string will be generated from your query). In this case `event:*:*:*`
```javascript
events.on({
  type: 'event'
})
```

#### subscriptions
* **on(query, callback)** _subscribe to all events matching the query_
* **once(query, callback)** _subscribe to the first event matching the query_
* **any(callback)** _subscribe to any event_

<hr>

### Unsubscribing to events
All subscriptions return a disposer that can be called to dispose the event listener.
```javascript
const dispose = events.on({
  type: 'test'
}, (message) => {

  console.log(message)

  if (message.action === 'quit') {
    dispose()
  }
})
```
