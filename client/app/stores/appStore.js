import _ from 'lodash'

const actions = {
  setSearchParams(state, action) {
    return _.extend({}, state, {params: action.searchParams});
  },

  doRequest(state, action) {
    return _.extend({}, state, { status: { fetching: true, empty: false, message: "Fetching stats for: " + action.botId }});
  }
}

export default function store(state, action) {
  let selectedAction = actions[action.type]

  if(selectedAction)
    return selectedAction(state, action)
  else
    return state
}
