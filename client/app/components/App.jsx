import React from 'react';
import SearchForm from './SearchForm';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      params: null,
      status: {
        empty: true,
        message: 'Ready to do some queries?'
      },
      result: null
    }
  }

  searchParams(params) {
    this.setState({params: params})
  }


  render() {
    return <SearchForm params={this.state.params} onSubmit={this.searchParams.bind(this)}/>;
  }
}


/*
search: {

 params: {
   bots: []
   dimentions: []
   range: {
     from: Date
     to: Date
   },
   granularity: Granularity.types
 },

 status: {
   empty: | error: | fetching: | ok:
   message:
 },

 result: {

  description: {
    bots: []
    dimentions: []
    range: {
      from: Date
      to: Date
    },
    effectiveRange: {
      from: Date
      to: Date
    },
    granularity: Granularity.types
  },

  data: {
    123: {},
    2323: {}
  }

 }

},


*/
