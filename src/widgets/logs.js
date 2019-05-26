const blessed = require('blessed');

const { UPDATE_LOGS } = require('../actions');
const { LOGS } = require('../constants');

class LogsWidget {
  constructor(middleware, state, screen, grid) {
    this.middleware = middleware;
    this.state = state;
    this.screen = screen;
    this.grid = grid;
  }

  render() {
    this.middleware.on(UPDATE_LOGS, () => {
      const logsBox = this.grid.set(3, 3, 9, 9, blessed.box, {
        scrollable: true,
        label: '( Logs )',
        content: this.state[LOGS],
        vi: true,
      });
      logsBox.focus();
      this.screen.append(logsBox);
      logsBox.on('keypress', (_, key) => {
        if (key.name === 'Escape') {
          logsBox.hide();
        }
      });
    });
  }
}

module.exports = LogsWidget;
