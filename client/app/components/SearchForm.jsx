import React from 'react';

import Granularity from '../enums/granularity';
import Dimensions from '../enums/dimensions';


class FormInput extends React.Component {

  render() {
    return <div className="form-group">
             <label htmlFor={this.props.id}>{this.props.label}</label>
             <input onChange={this.onChange.bind(this)}
                    type={this.props.type}
                    className="form-control"
                    id={this.props.id}
                    value={this.props.value} />
           </div>
  }

  onChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }
}

class FormSelect extends React.Component {

  render() {
    return <div className="form-group">
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <select id={this.props.id} multiple onChange={this.onChange.bind(this)}>
              {
                Object.keys(this.props.options).map((k) => {
                  if(_.contains(this.props.value, k)) {
                    return <option selected value={k}>{this.props.options[k]}</option>
                  } else {
                    return <option value={k}>{this.props.options[k]}</option>
                  }

                })
              }
            </select>
           </div>
  }

  onChange(e) {
    const values = Array.prototype.filter.call(e.target.options, (option) => {
                     return option.selected != false;
                   })
                   .map((option) => {
                     return option.value;
                   });

    this.props.onChange(this.props.id, values);
  }

}



export default class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      botId: '54c7c8bb7365df0300d56bcd',
      dimensions: 'accepted',
      granularity: 'by-min',
      dateFrom: '2015-01-30T12:10:10Z',
      dateTo: '2015-01-31T12:10:10Z'
    }
  }

  propertyChanged(id, value) {
    let stateChange = {};
    stateChange[id] = value;
    this.setState(stateChange);
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = this.state;
    this.props.onSearch(formData);
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
    return  <form role="form" onSubmit={this.handleSubmit.bind(this)}>

              <FormInput id="botId" type="text" label="Bot id:"
                value={this.state.botId} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="granularity" options={Granularity} label="Granularity:"
                value={this.state.granularity} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="dimensions" options={Dimensions} label="Dimensions:"
                value={this.state.dimensions} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="dateFrom" type="datetime-local" label="From:"
                value={this.stripTimeZone(this.state.dateFrom)} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="dateTo" type="datetime-local" label="To:"
                value={this.stripTimeZone(this.state.dateTo)} onChange={this.propertyChanged.bind(this)}/>

              <button type="submit" class="btn btn-default">Submit</button>
            </form>
  }
}
