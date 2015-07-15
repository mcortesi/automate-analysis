import React from 'react';
import SearchForm from './SearchForm';

import store from '../stores/appStore';
import createDispatcher from '../actions/dispatcher';

const {dispatch, subscribe} = createDispatcher(store, initialState())

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
           </div>
  }

  handleNewSearch(searchParams) {
    dispatch({ type: 'setSearchParams', searchParams: searchParams });
    dispatch({ type: 'doRequest', botId: searchParams.botId });
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
