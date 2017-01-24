'use strict'

const assert = require('assert')
const uuid = require('uuid').v4
const RedisEmitter = require('../')

describe('RedisEmitter.any()', () => {

  it('should subscribe to any event', (done) => {

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

    redisEmitter.any((message) => {
      count++

      switch (count) {
        case '1': assert.equal(message.type, 'test0')
        case '2': assert.equal(message.type, 'test1')
        case '3': assert.equal(message.type, 'test2')
      }
    })

    setTimeout(() => {
      assert.equal(count, 3)
      done()
      redisEmitter.quit()
    }, 20)

    setTimeout(() => {
      for (i = 0; i < 3; i++)
        redisEmitter.emit({
          type: 'test' + i,
          action: 'fest',
          name: 'name',
          id: uuid()
        })
    }, 10)
  })
})
