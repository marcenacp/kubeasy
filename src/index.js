const EventEmitter = require('events');

const { initWidgets } = require('./widgets');

const kubeasy = () => {
  const state = {};
  const middleware = new EventEmitter();
  initWidgets(middleware);
};

module.exports = {
  kubeasy,
};
