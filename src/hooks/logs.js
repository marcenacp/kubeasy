const { exec } = require('child_process');

const { GET_LOGS, SET_LOGS, UPDATE_LOGS } = require('../actions');
const { ACTIVE_POD, LOGS, SHORT_TIMEOUT } = require('../constants');

class LogsHook {
  constructor(middleware, state) {
    this.middleware = middleware;
    this.state = state;
  }

  get() {
    this.middleware.on(
      GET_LOGS,
      () => {
        const podId = this.state[ACTIVE_POD];
        exec(`kubectl logs ${podId}`, (error, stdout) => {
          this.middleware.emit(SET_LOGS, stdout);
        });
      },
      SHORT_TIMEOUT,
    );
  }

  set() {
    this.middleware.on(SET_LOGS, data => {
      if (this.state[LOGS] !== data) {
        this.state[LOGS] = data.toString();
        this.middleware.emit(UPDATE_LOGS);
      }
    });
  }
}

module.exports = LogsHook;
