const ActiveClusterHook = require('./activeCluster');
const PodsHook = require('./pods');
const LogsHook = require('./logs');

const initHooks = (middleware, state) => {
  const Hooks = [LogsHook, PodsHook, ActiveClusterHook];
  Hooks.forEach(Hook => {
    const hook = new Hook(middleware, state);
    hook.get();
    hook.set();
  });
};

module.exports = {
  initHooks,
};
