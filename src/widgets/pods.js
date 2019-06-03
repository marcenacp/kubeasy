const blessed = require('blessed');
const _ = require('lodash');

const { GET_BASH, GET_LOGS, UPDATE_PODS } = require('../actions');
const { ACTIVE_POD, PODS } = require('../constants');

class PodsWidget {
  constructor(middleware, state, screen) {
    this.middleware = middleware;
    this.state = state;
    this.screen = screen;

    this.create();
    this.render();
  }

  render() {
    this.middleware.on(UPDATE_PODS, () => {
      this.widget.focus();
      this.widget.setData([['NAME', 'STATUS'], ...this.state[PODS]]);
    });
  }

  hide() {}

  create() {
    this.widget = blessed.listtable({
      align: 'center',
      border: 'line',
      data: null,
      height: Math.floor(this.screen.height * 0.8),
      interactive: true,
      keys: true,
      label: '( Pods )',
      left: 0,
      mouse: true,
      parent: this.screen,
      tags: true,
      top: Math.floor(this.screen.height * 0.2),
      width: '100%',
      style: {
        border: { fg: 'blue' },
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
      hover: {
        bg: 'blue',
      },
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
