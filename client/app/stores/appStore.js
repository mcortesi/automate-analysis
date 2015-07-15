import _ from 'lodash'

function updateState(oldState, stateChange) {
  return _.extend({}, oldState, stateChange);
}

const actions = {

  setSearchParams(state, action) {
    return updateState(state, {
      params: action.searchParams
    });
  },

  startRequest(state, action) {
    return updateState(state, {
      status: {
        fetching: true,
        message: `Fetching stats for: ${action.botId}`
      }
    });
  },

  endRequest(state, action) {
    return updateState(state, {
      result: action.result,
      status: action.status
    });
  }
}

export default function store(state, action) {
  let selectedAction = actions[action.type]

  if(selectedAction)
    return selectedAction(state, action)
  else
    return state
}
