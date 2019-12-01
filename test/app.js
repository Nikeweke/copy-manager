const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new EventEmitter();
myEmitter.on('event', (res) => {
  console.log('an event occurred!', res);
});
myEmitter.emit('event', 111);
