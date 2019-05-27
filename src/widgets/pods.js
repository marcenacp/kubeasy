const blessed = require('blessed');
const _ = require('lodash');

const { GET_BASH, GET_LOGS, UPDATE_PODS } = require('../actions');
const { ACTIVE_POD, PODS } = require('../constants');

class PodsWidget {
  constructor(middleware, state, screen, grid) {
    this.middleware = middleware;
    this.state = state;
    this.screen = screen;
    this.grid = grid;
  }

  focus() {
    this.middleware.on(UPDATE_PODS, () => {
      this.widget.focus();
      this.widget.setData([['NAME', 'STATUS'], ...this.state[PODS]]);
    });
  }

  hide() {}

  render() {
    this.widget = this.grid.set(3, 0, 5, 5, blessed.listtable, {
      parent: this.screen,
      label: '( Pods )',
      keys: true,
      mouse: true,
      data: null,
      tags: true,
      interactive: true,
      border: 'line',
      hover: {
        bg: 'blue',
      },
      style: {
        header: {
          fg: 'blue',
          bold: true,
        },
        cell: {
          fg: 'magenta',
          selected: {
            bg: 'blue',
          },
        },
      },
      align: 'center',
    });
    this.widget.on('keypress', (event, key) => {
      this.state[ACTIVE_POD] = _.get(this.state, `[${PODS}][${this.widget.selected - 1}][0]`);
      if (key.name === 'l') {
        this.middleware.emit(GET_LOGS);
      }
      if (key.name === 's') {
        this.middleware.emit(GET_BASH);
      }
    });
  }
}

module.exports = PodsWidget;
