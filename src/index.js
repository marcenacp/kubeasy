const EventEmitter = require('events');

const { initWidgets } = require('./widgets');

const kubeasy = () => {
  const eventMiddleware = new EventEmitter();
  initWidgets(eventMiddleware);
};

module.exports = {
  kubeasy,
};
