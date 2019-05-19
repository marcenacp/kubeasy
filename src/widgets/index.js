const blessed = require('blessed');
const contrib = require('blessed-contrib');
const { exec, execSync } = require('child_process');
const _ = require('lodash');

const SET_ACTIVE_CLUSTER_EVENT = 'SET_ACTIVE_CLUSTER_EVENT';
const SET_PODS_EVENT = 'SET_PODS_EVENT';
const CHANGE_ACTIVE_CLUSTER_EVENT = 'CHANGE_ACTIVE_CLUSTER_EVENT';
const DEBUG_EVENT = 'DEBUG_EVENT';
const SET_LOGS_EVENT = 'SET_LOGS_EVENT';
const GET_LOGS_EVENT = 'GET_LOGS_EVENT';

const SHORT_TIMEOUT = 500;
const LONG_TIMEOUT = 30000;

class PodsWidget {
  constructor(eventMiddleWare, screen, grid) {
    this.eventMiddleware = eventMiddleWare;
    this.screen = screen;
    this.grid = grid;
  }

  get() {
    const executeCommand = () => {
      exec('kubectl get pods -o=json', (error, stdout) => {
        this.eventMiddleware.emit(SET_PODS_EVENT, JSON.parse(stdout));
      });
    };

    setInterval(executeCommand, LONG_TIMEOUT);
    this.eventMiddleware.on(CHANGE_ACTIVE_CLUSTER_EVENT, executeCommand);
  }

  display() {
    this.eventMiddleware.on(SET_PODS_EVENT, data => {
      const { items } = data;
      const podsData = items.map(item => [
        _.get(item, 'metadata.name', ''),
        _.get(item, 'status.conditions[0].type', ''),
      ]);
      const table = this.grid.set(3, 0, 5, 5, blessed.listtable, {
        parent: this.screen,
        label: 'Label',
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
      table.focus();
      table.setData([['NAME', 'STATUS'], ...podsData]);
      table.on('keypress', (_, key) => {
        if (key.name === 'enter') {
          this.eventMiddleware.emit(GET_LOGS_EVENT, podsData[table.selected][0]);
        }
      });
    });
  }
}

class DebugWidget {
  constructor(eventMiddleWare, screen, grid) {
    this.eventMiddleware = eventMiddleWare;
    this.screen = screen;
    this.grid = grid;
  }

  get() {}

  display() {
    this.eventMiddleware.on(DEBUG_EVENT, data => {
      const log = this.grid.set(0, 4, 3, 3, contrib.log, {
        label: 'Debug',
      });
      log.log(data.toString());
      this.screen.append(log);
    });
  }
}

class LogWidget {
  constructor(eventMiddleWare, screen, grid) {
    this.eventMiddleware = eventMiddleWare;
    this.screen = screen;
    this.grid = grid;
  }

  get() {
    this.eventMiddleware.on(GET_LOGS_EVENT, data => {
      exec(`kubectl logs ${data}`, (error, stdout) => {
        this.eventMiddleware.emit(SET_LOGS_EVENT, stdout);
      });
    });
  }

  display() {
    this.eventMiddleware.on(SET_LOGS_EVENT, data => {
      const logs = data.toString();
      const logsBox = this.grid.set(3, 3, 9, 9, blessed.box, {
        scrollable: true,
        name: 'Debug',
        content: logs,
        vi: true,
      });
      logsBox.focus();
      this.screen.append(logsBox);
      logsBox.on('keypress', (_, key) => {
        this.eventMiddleware.emit(DEBUG_EVENT, key.name);
        if (key.name === 'Escape') {
          logsBox.hide();
        }
      });
    });
  }
}

class ActiveClusterWidget {
  constructor(eventMiddleWare, screen, grid) {
    this.previousCluster = '';
    this.eventMiddleware = eventMiddleWare;
    this.screen = screen;
    this.grid = grid;
  }

  get() {
    setInterval(() => {
      exec('kubectl config current-context', (error, stdout) => {
        this.eventMiddleware.emit(SET_ACTIVE_CLUSTER_EVENT, stdout);

        if (stdout !== this.previousCluster) {
          this.eventMiddleware.emit(CHANGE_ACTIVE_CLUSTER_EVENT);
          this.previousCluster = stdout;
        }
      });
    }, SHORT_TIMEOUT);
  }

  display() {
    this.eventMiddleware.on(SET_ACTIVE_CLUSTER_EVENT, data => {
      if (data !== this.previousCluster) {
        const log = this.grid.set(0, 0, 3, 3, contrib.log, {
          fg: 'green',
          selectedFg: 'green',
          label: 'Active cluster',
        });
        log.log(data);
        this.screen.append(log);
      }
    });
  }
}

const initWidgets = eventMiddleware => {
  const screen = blessed.screen();
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
  const Widgets = [ActiveClusterWidget, PodsWidget, DebugWidget, LogWidget];
  Widgets.forEach(Widget => {
    const widget = new Widget(eventMiddleware, screen, grid);
    widget.get();
    widget.display();
  });
  screen.key(['q'], () => process.exit(0));
  screen.render();
};

module.exports = {
  initWidgets,
};
