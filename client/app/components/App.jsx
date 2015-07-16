import React from 'react';
import SearchForm from './SearchForm';
import Chart from './Chart';

import appStore from '../stores/appStore';
import dispatcher from '../actions/dispatcher';

import request from 'superagent';
import Bluebird from 'bluebird'

import DateService from '../services/dateService'

Bluebird.promisifyAll(request)

/*
  Example `http://localhost:3000/api/bots/buzz-data?bots=54c7c8bb7365df0300d56bcd&dimensions=accepted&granularity=by-min&from=2015-01-30T12:10:10Z&to=2015-01-31T12:10:10Z`
*/

function STATS_ENPOINT(params) {
  let { botId, dimensions, granularity, dateFrom, dateTo } = params;

  dateFrom = DateService.toServerFormat(dateFrom);
  dateTo = DateService.toServerFormat(dateTo);

  return `http://localhost:3000/api/bots/buzz-data?bots=${botId}&dimensions=${dimensions}&granularity=${granularity}&from=${dateFrom}&to=${dateTo}`
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState();
  }

  componentWillMount() {
    this.unsubscribe = dispatcher.subscribe(this.setState.bind(this));
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
             {this.state.result ? <Chart data={this.state.result}/> : <span>No data</span>}
           </div>
  }

  handleNewSearch(searchParams) {
    dispatcher.dispatch(appStore, { type: 'setSearchParams', state: this.state, searchParams: searchParams });
    dispatcher.dispatch(appStore, { type: 'startRequest', state: this.state, botId: searchParams.botId });

    const uri = STATS_ENPOINT(searchParams);

    request
     .get(uri)
     .endAsync()
     .then((result) => {
       dispatcher.dispatch(appStore, { type: 'endRequest', state: this.state, result: result.body, status: { success: true, message: 'Fetched OK.' } });
     })
     .catch((error) => {
       const message = `Request to ${uri} failed with: ${error.message}`
       dispatcher.dispatch(appStore, { type: 'endRequest', state: this.state, botId: searchParams.botId, status: { error: true, message: message } });
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
    result: null
  }
}
