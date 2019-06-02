const XTerm = require('blessed-xterm');

const { GET_BASH } = require('../actions');
const { ACTIVE_POD } = require('../constants');

class BashWidget {
  constructor(middleware, state, screen) {
    this.middleware = middleware;
    this.state = state;
    this.screen = screen;

    this.create();
    this.render();
  }

  render() {
    this.middleware.on(GET_BASH, () => {
      const terminal = new XTerm({
        align: 'left',
        args: [],
        border: 'line',
        cursorType: 'block',
        cwd: process.cwd(),
        env: process.env,
        height: Math.floor(this.screen.height * 0.7),
        label: '( Bash )',
        left: 'center',
        scrollback: 1000,
        shell: process.env.SHELL || 'sh',
        top: 'center',
        width: Math.floor(this.screen.width * 0.7),
        style: {
          fg: 'default',
          bg: 'default',
          border: { fg: 'default' },
          focus: { border: { fg: 'green' } },
          scrolling: { border: { fg: 'red' } },
        },
      });
      terminal.focus();
      const podId = this.state[ACTIVE_POD];
      terminal.injectInput(`kubectl exec -it ${podId} -- bash\n`);
      this.screen.append(terminal);
      terminal.on('keypress', (_, key) => {
        if (key.name === 'escape') {
          terminal.destroy();
        }
      });
    });
  }

  hide() {}

  create() {}
}

module.exports = BashWidget;
