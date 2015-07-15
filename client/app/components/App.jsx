import React from 'react';
import SearchForm from './SearchForm';
import Chart from './Chart';

import store from '../stores/appStore';
import createDispatcher from '../actions/dispatcher';

import request from 'superagent';
import Bluebird from 'bluebird'

import DateService from '../services/dateService'

Bluebird.promisifyAll(request)

const {dispatch, subscribe} = createDispatcher(store, initialState())

/*
  Example `http://localhost:3000/api/bots/buzz-data?bots=54c7c8bb7365df0300d56bcd&dimensions=accepted&granularity=by-min&from=2015-01-30T12:10:10Z&to=2015-01-31T12:10:10Z`
*/

function STATS_ENPOINT(params) {
  let { botId, dimensions, granularity, dateFrom, dateTo } = params;

  dateFrom = DateService.toServerFormat(dateFrom);
  dateTo = DateService.toServerFormat(dateTo);

  return `http://localhost:3000/api/bots/buzz-data?
          bots=${botId}&
          dimensions=${dimensions}&
          granularity=${granularity}&
          from=${dateFrom}
          to=${dateTo}`
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState();
  }

  componentWillMount() {
    this.unsubscribe = subscribe(this.setState.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <div>
             <h1>{this.state.status.message}</h1>
             <hr/>
             <SearchForm onSearch={this.handleNewSearch.bind(this)}/>
             <div>{JSON.stringify(this.state)}</div>
             <h1>Chart</h1>
             <hr/>
             <Chart data={this.state.result}/>
           </div>
  }

  handleNewSearch(searchParams) {
    dispatch({ type: 'setSearchParams', searchParams: searchParams });
    dispatch({ type: 'startRequest', botId: searchParams.botId });

    const uri = STATS_ENPOINT(searchParams);

    request
     .get(uri)
     .withCredentials()
     .endAsync()
     .then((result) => {
       dispatch({ type: 'endRequest', result: result, status: { success: true, message: 'Fetched OK.' } });
     })
     .catch((error) => {
       const message = `Request to ${uri} failed with: ${error.message}`
       dispatch({ type: 'endRequest', botId: searchParams.botId, status: { error: true, message: message } });
     })
  }

}

function initialState() {
  return {
    params: null,
    status: {
      empty: true,
      message: 'Ready to do some queries?'
    },
    result: {
      "description": {
        "effective-from": "2015-02-10T16:00:00.000Z",
        "from": "2015-02-10T16:44:00.000Z",
        "to": "2015-02-11T11:14:00.000Z",
        "effective-to": "2015-02-11T11:00:00.000Z",
        "granularity": "hours",
        "dimensions": [
          "accepted"
        ],
        "bots": [
          "54c7c8bb7365df0300d56bcd"
        ]
      },
      "stats": {
        "54c7c8bb7365df0300d56bcd": {
          "accepted": [
            1864,
            431,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        }
      }
    }
  }
}
