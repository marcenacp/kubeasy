const blessed = require('blessed');

class ActionsWidget {
  constructor(middleware, state, screen) {
    this.middleware = middleware;
    this.screen = screen;
    this.state = state;

    this.create();
    this.render();
  }

  render() {}

  hide() {}

  create() {
    this.widget = blessed.listbar({
      mouse: true,
      align: 'left',
      alwaysScroll: true,
      commands: {
        'Logs [L]': {},
        'Shell [S]': {},
        'Return [Echap]': {},
        'Quit [Ctrl-C]': {},
      },
      select: null,
      height: Math.floor(this.screen.height * 0.2),
      keys: false,
      label: '( Actions )',
      left: Math.floor(this.screen.width * 0.3),
      scrollable: true,
      top: 0,
      width: Math.floor(this.screen.width * 0.7),
      style: {
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

module.exports = ActionsWidget;
