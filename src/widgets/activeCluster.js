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
      label: '( Active cluster )',

      scrollable: true,
      alwaysScroll: true,
      keys: true,
      style: {
        selected: {
          bg: 'green',
        },
      },
      border: {
        type: 'line',
      },
      hover: {
        bg: 'blue',
      },
      scrollbar: {
        fg: 'blue',
        ch: '|',
      },
      align: 'left',
      width: '30%',
      height: '30%',
      top: 0,
      left: 0,
      content: 'Loading...',
    });
    this.screen.append(this.widget);
  }
}

module.exports = ActiveClusterWidget;
