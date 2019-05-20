const {
  GET_ACTIVE_CLUSTER,
  GET_LOGS,
  GET_PODS,
  SET_ACTIVE_CLUSTER,
  SET_LOGS,
  SET_PODS,
} = require('../actions');

const ActiveClusterHook = require('./activeCluster');
const PodsHook = require('./pods');

// class DebugHook {
//   constructor(middleware) {
//     this.middleware = middleware;
//   }
//
//   get() {}
//
//   set() {}
// }
//
// class LogHook {
//   constructor(middleware) {
//     this.middleware = middleware;
//   }
//
//   get() {
//     this.middleware.on(GET_LOGS_EVENT, data => {
//       exec(`kubectl logs ${data}`, (error, stdout) => {
//         this.middleware.emit(SET_LOGS_EVENT, stdout);
//       });
//     });
//   }
//
//   set() {}
// }

const initHooks = (middleware, state) => {
  const Hooks = [PodsHook, ActiveClusterHook];
  Hooks.forEach(Hook => {
    const hook = new Hook(middleware, state);
    hook.get();
    hook.set();
  });
};

module.exports = {
  initHooks,
};
