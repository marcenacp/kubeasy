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
    const LAST_TRANSITION_TIME = 'lastTransitionTime';
    const { items } = data;
    return items.map(item => {
      const name = _.get(item, 'metadata.name', '');
      const conditions = _.get(item, 'status.conditions', [])
        .filter(condition => !!_.get(condition, LAST_TRANSITION_TIME))
        .map(condition => ({
          ...condition,
          [LAST_TRANSITION_TIME]: new Date(_.get(condition, LAST_TRANSITION_TIME)),
        }))
        .sort(
          (condition1, condition2) =>
            _.get(condition2, LAST_TRANSITION_TIME) - _.get(condition1, LAST_TRANSITION_TIME),
        );
      const latestCondition = _.get(conditions, `[0].type`, '');

      return [name, latestCondition];
    });
  }

  set() {
    this.middleware.on(SET_PODS, data => {
      const formattedData = this.formatData(data);

      if (!_.isEqual(this.state[PODS], formattedData)) {
        this.state[PODS] = formattedData;
        this.middleware.emit(UPDATE_PODS);
      }
    });
  }
}

module.exports = PodsHook;
