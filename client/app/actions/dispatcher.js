export default function createDispatcher(store, initialState) {
  let state = initialState;
  const listeners = [];

  function dispatch(action) {
    state = store(state, action);
    emitChange();
  }

  function subscribe(listener) {
    listeners.push(listener);
    listener(state);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  function emitChange() {
    listeners.forEach(listener => listener(state));
  }

  return {
    dispatch,
    subscribe
  };
}
