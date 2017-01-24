'use strict'

const assert = require('assert')
const uuid = require('uuid').v4
const RedisEmitter = require('../')

describe('RedisEmitter.once()', () => {

  it('should only subscribe to the first matching event', (done) => {

    const redisEmitter = new RedisEmitter({
      query: {
        event: '*',
        type: '*',
        action: '*',
        id: '*',
      }
    })

    var count = 0
    var i

    redisEmitter.once({
      type: 'test',
      action: 'fest'
    }, (message) => {
      count++
    })

    setTimeout(() => {
      assert.equal(count, 1)
      done()
      redisEmitter.quit()
    }, 40)

    setTimeout(() => {
      for (i = 0; i < 3; i++)
        redisEmitter.emit({
          type: 'test',
          action: 'fest',
          name: 'name',
          id: uuid()
        })
    }, 20)
  })
})
