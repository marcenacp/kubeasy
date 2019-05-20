const { exec } = require('child_process');

const {
  GET_ACTIVE_CLUSTER,
  GET_LOGS,
  GET_PODS,
  SET_ACTIVE_CLUSTER,
  SET_LOGS,
  SET_PODS,
  UPDATE_ACTIVE_CLUSTER,
} = require('../actions');

const { ACTIVE_CLUSTER, SHORT_TIMEOUT } = require('../constants');

class ActiveClusterHook {
  constructor(middleware, state) {
    this.middleware = middleware;
    this.state = state;
  }

  get() {
    setInterval(() => {
      exec('kubectl config current-context', (error, stdout) => {
        this.middleware.emit(SET_ACTIVE_CLUSTER, stdout);
      });
    }, SHORT_TIMEOUT);
  }

  set() {
    this.middleware.on(SET_ACTIVE_CLUSTER, data => {
      if (this.state[ACTIVE_CLUSTER] !== data) {
        this.state[ACTIVE_CLUSTER] = data;
        this.middleware.emit(UPDATE_ACTIVE_CLUSTER);
      }
    });
  }
}

module.exports = ActiveClusterHook;
