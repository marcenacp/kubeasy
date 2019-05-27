const contrib = require('blessed-contrib');

const { UPDATE_ACTIVE_CLUSTER } = require('../actions');
const { ACTIVE_CLUSTER } = require('../constants');

class ActiveClusterWidget {
  constructor(middleware, state, screen, grid) {
    this.previousCluster = '';

    this.grid = grid;
    this.middleware = middleware;
    this.screen = screen;
    this.state = state;
  }

  focus() {
    this.middleware.on(UPDATE_ACTIVE_CLUSTER, () => {
      const activeCluster = this.state[ACTIVE_CLUSTER];
      if (activeCluster !== this.previousCluster) {
        this.widget.log(activeCluster);
      }
    });
  }

  hide() {}

  render() {
    this.widget = this.grid.set(0, 0, 3, 3, contrib.log, {
      fg: 'green',
      selectedFg: 'green',
      label: 'Active cluster',
    });
    this.screen.append(this.widget);
  }
}

module.exports = ActiveClusterWidget;
