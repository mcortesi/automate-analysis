import React from 'react';
import SearchForm from './SearchForm';
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
