const listeners = [];

function dispatch(store, action) {
  const state = store(action);
  emitChange(state);
}

function subscribe(listener) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }
}

function emitChange(state) {
  listeners.forEach(listener => listener(state));
}


export default {
  subscribe: subscribe,
  dispatch: dispatch
}
