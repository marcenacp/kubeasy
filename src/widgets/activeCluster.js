const blessed = require('blessed');

const { UPDATE_ACTIVE_CLUSTER } = require('../actions');
const { ACTIVE_CLUSTER } = require('../constants');

class ActiveClusterWidget {
  constructor(middleware, state, screen) {
    this.previousCluster = '';

    this.middleware = middleware;
    this.screen = screen;
    this.state = state;

    this.create();
    this.render();
  }

  render() {
    this.middleware.on(UPDATE_ACTIVE_CLUSTER, () => {
      const activeCluster = this.state[ACTIVE_CLUSTER];
      if (activeCluster !== this.previousCluster) {
        this.widget.setContent(activeCluster);
      }
    });
  }

  hide() {}

  create() {
    this.widget = blessed.box({
      align: 'left',
      alwaysScroll: true,
      content: 'Loading...',
      height: Math.floor(this.screen.height * 0.2),
      keys: true,
      label: '( Active cluster )',
      left: 0,
      scrollable: true,
      top: 0,
      width: Math.floor(this.screen.width * 0.3),
      style: {
        selected: { bg: 'blue' },
        focus: { border: { fg: 'blue' } },
        border: { fg: 'blue' },
      },
      border: {
        type: 'line',
      },
    });
    this.screen.append(this.widget);
  }
}

module.exports = ActiveClusterWidget;
