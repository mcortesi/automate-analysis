import React from 'react';

import Granularity from '../enums/granularity';
import Dimensions from '../enums/dimensions';
import DateService from '../services/dateService';


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
      botId: this.props.botId,
      dimensions: this.props.dimensions,
      granularity: this.props.granularity,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo
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

  handlePrefetch(e) {
    const formData = this.state;
    this.props.onPrefetchRanges(formData)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dateFrom: nextProps.dateFrom,
      dateTo: nextProps.dateTo
    });
  }

  render() {
    return  <form role="form" onSubmit={this.handleSubmit.bind(this)}>

              <FormInput id="botId" type="text" label="Bot id:"
                value={this.state.botId} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="granularity" options={Granularity} label="Granularity:"
                value={this.state.granularity} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="dimensions" options={Dimensions} label="Dimensions:"
                value={this.state.dimensions} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="dateFrom" type="text" label="From:"
                value={DateService.toDisplayFormat(this.state.dateFrom)} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="dateTo" type="text" label="To:"
                value={DateService.toDisplayFormat(this.state.dateTo)} onChange={this.propertyChanged.bind(this)}/>

              <button type="submit" class="btn btn-default">Submit</button>
              <button type="button" class="btn btn-default" onClick={this.handlePrefetch.bind(this)}>Fetch ranges</button>
            </form>
  }
}
