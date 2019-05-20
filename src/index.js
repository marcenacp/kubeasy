const EventEmitter = require('events');

const { initHooks } = require('./hooks');
const { initWidgets } = require('./widgets');

const kubeasy = () => {
  const state = {};
  const middleware = new EventEmitter();
  initWidgets(middleware, state);
  initHooks(middleware, state);
};

module.exports = {
  kubeasy,
};
