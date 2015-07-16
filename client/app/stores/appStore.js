import _ from 'lodash';
import dispatcher from '../actions/dispatcher';

import request from 'superagent';
import Bluebird from 'bluebird'

import {RANGE_ENPOINT, STATS_ENPOINT} from '../services/endpoints'

Bluebird.promisifyAll(request)



function updateState(oldState, stateChange) {
  return _.assign({}, oldState, stateChange);
}

function doRequest(uri) {
  return request
    .get(uri)
    .endAsync();
}

const actions = {

  findRanges(action) {
    dispatcher.dispatch(store, { type: 'botRangeRequest', state: action.state, botId: action.botId });
  },

  setSearchParams(action) {
    const newState = updateState(action.state, {
      params: action.searchParams
    });

    //COMO MEJORAMOS ESTO???
    //COMO ASEGURAMOS QUE EL COMPONENT NO RECIBIO UNA LLAMADA QUE MODIFICO EL ESTADO???
    //COMO HACEMOS PARA TENER SIEMPRE EL ESTADO DEL ARBOL SYNC???
      //LO MOVEMOS AL DISPATCHER?????
      //LO REPLICAMOS EN TODA STORE???? (PERO QUEREMOS QUE LAS STORES SEAN FUNCIONES PURAS)

    setTimeout(() => {
      dispatcher.dispatch(store, { type: 'statsRequest', state: newState, searchParams: action.searchParams });
    }, 0);

    return newState;
  },

  statsRequest(action) {
    const newState = updateState(action.state, {
      status: {
        fetching: true,
        message: `Fetching stats for: ${action.searchParams.botId}`
      }
    });

    const uri = STATS_ENPOINT(action.searchParams);

    doRequest(uri)
     .then((result) => {
       dispatcher.dispatch(store, { type: 'endStatsRequest', state: newState, result: result.body, status: { success: true, message: 'Fetched OK.' } });
     })
     .catch((error) => {
       const message = `Request to ${uri} failed with: ${error.message}`
       dispatcher.dispatch(store, { type: 'endStatsRequest', state: newState, botId: action.searchParams.botId, status: { error: true, message: message } });
     })

     return newState;
  },

  botRangeRequest(action) {
    const newState = updateState(action.state, {
      status: {
        fetching: true,
        message: `Fetching stats for: ${action.botId}`
      }
    });

    let searchParams = Object.create(action.state.searchParams);
    const uri = RANGE_ENPOINT(action.botId);

    doRequest(uri)
     .then((result) => {

       if(!result.body.first || !result.body.last) {
         throw new Error('Invalid ranges')
       }

       searchParams.dateFrom = result.body.first
       searchParams.dateTo = result.body.last

       dispatcher.dispatch(store, { type: 'endBotRangeRequest', state: newState, searchParams: searchParams, status: { success: true, message: 'Fetched OK.' } });
     })
     .catch((error) => {
       const message = `Request to ${uri} failed with: ${error.message}`
       dispatcher.dispatch(store, { type: 'endBotRangeRequest', state: newState, searchParams: searchParams, status: { error: true, message: message } });
     })

     return newState;
  },

  endStatsRequest(action) {
    return updateState(action.state, {
      result: action.result,
      status: action.status
    });
  },

  endBotRangeRequest(action) {
    let newState = {}

    return updateState(action.state, {
      searchParams: action.searchParams,
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
