const blessed = require('blessed');
const contrib = require('blessed-contrib');
const _ = require('lodash');

const ActiveClusterWidget = require('./activeCluster');
const PodsWidget = require('./pods');

const SET_ACTIVE_CLUSTER_EVENT = 'SET_ACTIVE_CLUSTER_EVENT';
const SET_PODS_EVENT = 'SET_PODS_EVENT';
const CHANGE_ACTIVE_CLUSTER_EVENT = 'CHANGE_ACTIVE_CLUSTER_EVENT';
const DEBUG_EVENT = 'DEBUG_EVENT';
const SET_LOGS_EVENT = 'SET_LOGS_EVENT';
const GET_LOGS_EVENT = 'GET_LOGS_EVENT';

//
// class DebugWidget {
//   constructor(middleware, screen, grid) {
//     this.middleware = middleware;
//     this.screen = screen;
//     this.grid = grid;
//   }
//
//   render() {
//     this.middleware.on(DEBUG_EVENT, data => {
//       const log = this.grid.set(0, 4, 3, 3, contrib.log, {
//         label: 'Debug',
//       });
//       log.log(data.toString());
//       this.screen.append(log);
//     });
//   }
// }
//
// class LogWidget {
//   constructor(middleware, screen, grid) {
//     this.middleware = middleware;
//     this.screen = screen;
//     this.grid = grid;
//   }
//
//   render() {
//     this.middleware.on(SET_LOGS_EVENT, data => {
//       const logs = data.toString();
//       const logsBox = this.grid.set(3, 3, 9, 9, blessed.box, {
//         scrollable: true,
//         name: 'Debug',
//         content: logs,
//         vi: true,
//       });
//       logsBox.focus();
//       this.screen.append(logsBox);
//       logsBox.on('keypress', (_, key) => {
//         this.middleware.emit(DEBUG_EVENT, key.name);
//         if (key.name === 'Escape') {
//           logsBox.hide();
//         }
//       });
//     });
//   }
// }

const initWidgets = (middleware, state) => {
  const screen = blessed.screen();
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
  const Widgets = [PodsWidget, ActiveClusterWidget];
  Widgets.forEach(Widget => {
    const widget = new Widget(middleware, state, screen, grid);
    widget.render();
  });
  screen.key(['q'], () => process.exit(0));
  screen.render();
};

module.exports = {
  initWidgets,
};
