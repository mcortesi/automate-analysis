import _ from 'lodash'

function updateState(oldState, stateChange) {
  return _.extend({}, oldState, stateChange);
}

const actions = {

  setSearchParams(action) {
    return updateState(action.state, {
      params: action.searchParams
    });
    
  },

  startRequest(action) {
    return updateState(action.state, {
      status: {
        fetching: true,
        message: `Fetching stats for: ${action.botId}`
      }
    });
  },

  endRequest(action) {
    return updateState(action.state, {
      result: action.result,
      status: action.status
    });
  }
}

export default function store(action) {
  let selectedAction = actions[action.type]

  if(selectedAction)
    return selectedAction(action)
  else
    return state
}
