import _ from 'lodash';
import dispatcher from '../actions/dispatcher';

import request from 'superagent';
import Bluebird from 'bluebird'

import DateService from '../services/dateService'

Bluebird.promisifyAll(request)

function STATS_ENPOINT(params) {
  let { botId, dimensions, granularity, dateFrom, dateTo } = params;

  dateFrom = DateService.toServerFormat(dateFrom);
  dateTo = DateService.toServerFormat(dateTo);

  return `http://localhost:3000/api/bots/buzz-data?bots=${botId}&dimensions=${dimensions}&granularity=${granularity}&from=${dateFrom}&to=${dateTo}`
}

function updateState(oldState, stateChange) {
  return _.extend({}, oldState, stateChange);
}

const actions = {

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
      dispatcher.dispatch(store, { type: 'startRequest', state: newState, searchParams: action.searchParams });
    }, 0);

    return newState;
  },

  startRequest(action) {
    const newState = updateState(action.state, {
      status: {
        fetching: true,
        message: `Fetching stats for: ${action.searchParams.botId}`
      }
    });

    const uri = STATS_ENPOINT(action.searchParams);

    request
     .get(uri)
     .endAsync()
     .then((result) => {
       dispatcher.dispatch(store, { type: 'endRequest', state: newState, result: result.body, status: { success: true, message: 'Fetched OK.' } });
     })
     .catch((error) => {
       const message = `Request to ${uri} failed with: ${error.message}`
       dispatcher.dispatch(store, { type: 'endRequest', state: newState, botId: searchParams.botId, status: { error: true, message: message } });
     })

     return newState;
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
