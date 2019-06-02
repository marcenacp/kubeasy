const blessed = require('blessed');
const contrib = require('blessed-contrib');
const _ = require('lodash');

const ActiveClusterWidget = require('./activeCluster');
const BashWidget = require('./bash');
const LogsWidget = require('./logs');
const PodsWidget = require('./pods');

const initWidgets = (middleware, state) => {
  const screen = blessed.screen({ smartCSR: true });
  const Widgets = [BashWidget, LogsWidget, PodsWidget, ActiveClusterWidget];
  Widgets.forEach(Widget => {
    new Widget(middleware, state, screen);
  });
  screen.key(['C-c'], () => process.exit(0));
  screen.render();
};

module.exports = {
  initWidgets,
};
