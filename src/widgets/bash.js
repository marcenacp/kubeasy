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
        shell: process.env.SHELL || 'sh',
        args: [],
        env: process.env,
        cwd: process.cwd(),
        cursorType: 'block',
        border: 'line',
        scrollback: 1000,
        style: {
          fg: 'default',
          bg: 'default',
          border: { fg: 'default' },
          focus: { border: { fg: 'green' } },
          scrolling: { border: { fg: 'red' } },
        },
        align: 'left',
        left: 'center',
        top: 'center',
        width: Math.floor(this.screen.width * 0.7),
        height: Math.floor(this.screen.height * 0.7),
        label: 'Bash',
      });
      terminal.focus();
      const podId = this.state[ACTIVE_POD];
      terminal.injectInput(`kubectl exec -it ${podId} -- bash\n`);
      this.screen.append(terminal);
    });
  }

  hide() {}

  create() {}
}

module.exports = BashWidget;
