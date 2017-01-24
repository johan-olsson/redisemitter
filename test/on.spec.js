'use strict'

const assert = require('assert')
const uuid = require('uuid').v4
const RedisEmitter = require('../')

describe('RedisEmitter.on()', () => {

  it('should subscribe to events matching given query', (done) => {

    const redisEmitter = new RedisEmitter()

    var count = 0
    var i

    redisEmitter.on({
      type: 'test',
      action: 'fest'
    }, (message) => {
      assert.equal(message.type, 'test')
      assert.equal(message.action, 'fest')
      assert.equal(message.name, 'name')

      count++

      if (count === 3) {
        done()
        redisEmitter.quit()
      }
    })

    setTimeout(() => {
      for (i = 0; i < 3; i++)
        redisEmitter.emit({
          type: 'test',
          action: 'fest',
          name: 'name',
          id: uuid()
        })
    }, 10)
  })

  it('should only subscribe to matching events', (done) => {

    const redisEmitter = new RedisEmitter({
      query: {
        event: '*',
        type: '*',
        action: '*',
        id: '*',
      }
    })

    redisEmitter.on({
      type: 'test',
      action: 'fest'
    }, (message) => {
      assert.equal(message.type, 'test')
      assert.equal(message.action, 'fest')
      assert.equal(message.name, 'name')

      done()
      redisEmitter.quit()
    })

    setTimeout(() => {
      redisEmitter.emit({
        type: 'test',
        action: 'fest2',
        name: 'name',
        id: uuid()
      })
      redisEmitter.emit({
        type: 'test',
        action: 'fest',
        name: 'name',
        id: uuid()
      })
    }, 20)
  })

  it('should only trigger callback once per event', (done) => {

    const redisEmitter = new RedisEmitter()
    const events = []

    redisEmitter.on({
      type: 'test',
      action: 'fest'
    }, (message) => {
      events.push(message)
    })

    redisEmitter.on({
      type: 'test',
      action: 'fest'
    }, (message) => {
      events.push(message)
    })

    setTimeout(() => {
      redisEmitter.emit({
        type: 'test',
        action: 'fest',
        name: 'name',
        id: uuid()
      })
    }, 10)
    setTimeout(() => {

      assert.equal(events.length, 2)

      events.sort((a, b) => {
        Object.keys(a).forEach((key) => {
          assert.equal(a[key], b[key])
        })
      })

      done()
      redisEmitter.quit()
    }, 20)
  })
})
