const { exec } = require('child_process');

const { GET_LOGS, SET_LOGS, UPDATE_LOGS } = require('../actions');
const { ACTIVE_POD, LOGS, SHORT_TIMEOUT } = require('../constants');

class LogsHook {
  constructor(middleware, state) {
    this.middleware = middleware;
    this.state = state;
  }

  get() {
    this.middleware.on(GET_LOGS, () => {
      const podId = this.state[ACTIVE_POD];
      exec(`kubectl logs ${podId}`, (error, stdout) => {
        this.middleware.emit(SET_LOGS, stdout);
      });
    });
  }

  set() {
    this.middleware.on(SET_LOGS, data => {
      const logsData = data.toString();
      if (this.state[LOGS] !== logsData) {
        this.state[LOGS] = logsData;
        this.middleware.emit(UPDATE_LOGS);
      }
    });
  }
}

module.exports = LogsHook;
