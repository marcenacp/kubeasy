const EventEmitter = require('events');

const { initWidgets } = require('./widgets');

const eventMiddleware = new EventEmitter();
initWidgets(eventMiddleware);
