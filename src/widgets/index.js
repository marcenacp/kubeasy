const blessed = require('blessed');
const contrib = require('blessed-contrib');
const _ = require('lodash');

const ActiveClusterWidget = require('./activeCluster');
const LogsWidget = require('./logs');
const PodsWidget = require('./pods');

const initWidgets = (middleware, state) => {
  const screen = blessed.screen();
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });
  const Widgets = [LogsWidget, PodsWidget, ActiveClusterWidget];
  Widgets.forEach(Widget => {
    const widget = new Widget(middleware, state, screen, grid);
    widget.render();
  });
  screen.key(['q', 'C-c'], () => process.exit(0));
  screen.render();
};

module.exports = {
  initWidgets,
};
