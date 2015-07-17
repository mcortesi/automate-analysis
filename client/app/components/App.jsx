import React from 'react';
import SearchForm from './SearchForm';
import BotList from './BotList';
import Chart from './Chart';

import appStore from '../stores/appStore';
import dispatcher from '../actions/dispatcher';

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

  componentDidMount() {
    this.loadBots();
  }

  stripTimeZone(date) {
    const len = date.length;
    if(date.charAt(date.length - 1) == 'Z') {
      return date.substr(0, len - 1);
    } else {
      return date;
    }
  }

  render() {
    return <div>
             <h1>{this.state.status.message}</h1>
             <hr/>
             <BotList bots={this.state.bots} onBotSelected={this.handleBotSelection.bind(this)}/>

             <h1>Search form</h1>
             <hr/>
             <SearchForm
               botId={this.state.searchParams.botId}
               dimensions={this.state.searchParams.dimensions}
               granularity={this.state.searchParams.granularity}
               dateFrom={this.state.searchParams.dateFrom}
               dateTo={this.state.searchParams.dateTo}
               onSearch={this.handleNewSearch.bind(this)}
               onPrefetchRanges={this.prefetchRanges.bind(this)}/>

             <h1>Chart</h1>
             <hr/>
             {this.state.result ? <Chart data={this.state.result}/> : <span>No data</span>}

             <h1>Response</h1>
             <hr/>
             <div>{JSON.stringify(this.state)}</div>
           </div>
  }

  handleBotSelection(botId) {
    this.setState({
      searchParams: {
        botId: botId
      }
    });
  }

  loadBots(searchParams) {
    dispatcher.dispatch(appStore, { type: 'loadBots', state: this.state });
  }

  handleNewSearch(searchParams) {
    dispatcher.dispatch(appStore, { type: 'setSearchParams', state: this.state, searchParams: searchParams });
  }

  prefetchRanges(searchParams) {
    dispatcher.dispatch(appStore, { type: 'findRanges', state: this.state, botId: searchParams.botId });
  }

}

function initialState() {
  return {
    searchParams: {
      botId: 'lsdhflahsdfasdfasddlfhasd',
      dimensions: 'accepted',
      granularity: 'by-min',
      dateFrom: '2015-01-30T12:10:10Z',
      dateTo: '2015-01-31T12:10:10Z'
    },
    status: {
      empty: true,
      message: 'Ready to do some queries?'
    },
    result: null
  }
}
