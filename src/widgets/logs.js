const blessed = require('blessed');

const { UPDATE_LOGS } = require('../actions');
const { LOGS } = require('../constants');

class LogsWidget {
  constructor(middleware, state, screen) {
    this.middleware = middleware;
    this.state = state;
    this.screen = screen;

    this.create();
    this.render();
  }

  render() {
    this.middleware.on(UPDATE_LOGS, () => {
      this.widget.setContent(this.state[LOGS]);
      this.widget.setFront();
      this.widget.show();
      this.widget.focus();
      this.screen.render();
    });
  }

  hide() {}

  create() {
    this.widget = blessed.log({
      align: 'left',
      alwaysScroll: false,
      content: 'Loading...',
      height: '70%',
      keys: true,
      label: '( Logs )',
      left: 'center',
      parent: this.screen,
      scrollable: true,
      top: 'center',
      width: '70%',
      style: {
        selected: { bg: 'green' },
        focus: { border: { fg: 'green' } },
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
    });
    this.widget.hide();
    this.widget.on('keypress', (_, key) => {
      if (key.name === 'escape') {
        this.widget.hide();
        this.screen.render();
      }
    });
  }
}

module.exports = LogsWidget;
