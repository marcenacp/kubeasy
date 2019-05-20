const { exec } = require('child_process');
const _ = require('lodash');

const { SET_PODS, UPDATE_ACTIVE_CLUSTER, UPDATE_PODS } = require('../actions');
const { LONG_TIMEOUT, PODS } = require('../constants');

class PodsHook {
  constructor(middleware, state) {
    this.middleware = middleware;
    this.state = state;
  }

  exec() {
    exec('kubectl get pods -o=json', (error, stdout) => {
      this.middleware.emit(SET_PODS, JSON.parse(stdout));
    });
  }

  get() {
    setInterval(this.exec.bind(this), LONG_TIMEOUT);
    this.middleware.on(UPDATE_ACTIVE_CLUSTER, this.exec.bind(this));
  }

  formatData(data) {
    const { items } = data;
    return items.map(item => [
      _.get(item, 'metadata.name', ''),
      _.get(item, 'status.conditions[0].type', ''),
    ]);
  }

  set() {
    this.middleware.on(SET_PODS, data => {
      const formattedData = this.formatData(data);

      if (this.state[PODS] !== formattedData) {
        this.state[PODS] = formattedData;
        this.middleware.emit(UPDATE_PODS);
      }
    });
  }
}

module.exports = PodsHook;
