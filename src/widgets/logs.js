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

  // Function called in order to make widget appear
  focus() {
    this.middleware.on(UPDATE_LOGS, () => {
      this.widget.focus();
    });
  }

  hide() {}

  render() {
    this.widget = this.grid.set(3, 3, 9, 9, blessed.box, {
      scrollable: true,
      label: '( Logs )',
      content: this.state[LOGS],
      vi: true,
    });
    this.widget.hide();
    this.screen.append(this.widget);
    this.widget.on('keypress', (_, key) => {
      if (key.name === 'Escape') {
        this.widget.hide();
      }
    });
  }
}

module.exports = LogsWidget;
