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
    });
  }

  hide() {}

  create() {
    this.widget = blessed.box({
      label: '( Logs )',

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
      width: '70%',
      height: '70%',
      top: 'center',
      left: 'center',
      content: 'Loading...',
    });
    this.widget.hide();
    this.screen.append(this.widget);
    this.widget.on('keypress', (_, key) => {
      if (key.name === 'escape') {
        this.widget.hide();
      }
    });
  }
}

module.exports = LogsWidget;
