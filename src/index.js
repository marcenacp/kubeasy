const _ = require('lodash');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const EventEmitter = require('events');
const { exec, execSync } = require('child_process');

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

const SET_ACTIVE_CLUSTER_EVENT = 'SET_ACTIVE_CLUSTER_EVENT';
const SET_PODS_EVENT = 'SET_PODS_EVENT';
const CHANGE_ACTIVE_CLUSTER_EVENT = 'CHANGE_ACTIVE_CLUSTER_EVENT';
const DEBUG_EVENT = 'DEBUG_EVENT';
const SET_LOGS_EVENT = 'SET_LOGS_EVENT';
const GET_LOGS_EVENT = 'GET_LOGS_EVENT';

const SHORT_TIMEOUT = 500;
const LONG_TIMEOUT = 30000;

class PodsWidget {
  constructor(eventMiddleWare) {
    this.eventMiddleware = eventMiddleWare;
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
      const table = grid.set(3, 0, 5, 5, blessed.listtable, {
        parent: screen,
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
  constructor(eventMiddleWare) {
    this.eventMiddleware = eventMiddleWare;
  }

  get() {}

  display() {
    this.eventMiddleware.on(DEBUG_EVENT, data => {
      const log = grid.set(0, 4, 3, 3, contrib.log, {
        label: 'Debug',
      });
      log.log(data.toString());
      screen.append(log);
    });
  }
}

class LogWidget {
  constructor(eventMiddleWare) {
    this.eventMiddleware = eventMiddleWare;
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
      const logsBox = grid.set(3, 3, 9, 9, blessed.box, {
        scrollable: true,
        name: 'Debug',
        content: logs,
        vi: true,
      });
      logsBox.focus();
      screen.append(logsBox);
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
  constructor(eventMiddleWare) {
    this.previousCluster = '';
    this.eventMiddleware = eventMiddleWare;
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
        const log = grid.set(0, 0, 3, 3, contrib.log, {
          fg: 'green',
          selectedFg: 'green',
          label: 'Active cluster',
        });
        log.log(data);
        screen.append(log);
      }
    });
  }
}

const Widgets = [ActiveClusterWidget, PodsWidget, DebugWidget, LogWidget];
const eventMiddleware = new EventEmitter();
Widgets.forEach(Widget => {
  const widget = new Widget(eventMiddleware);
  widget.get();
  widget.display();
});

screen.key(['q'], () => process.exit(0));
screen.render();
