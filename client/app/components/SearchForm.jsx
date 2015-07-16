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
            <select className="form-control" id={this.props.id} multiple onChange={this.onChange.bind(this)}>
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
      botId: nextProps.botId,
      dateFrom: nextProps.dateFrom,
      dateTo: nextProps.dateTo
    });
  }

  render() {
    return  <form role="form" onSubmit={this.handleSubmit.bind(this)}>

              <div className="row">
                <div className="col-md-6 col-md-offset-6">

                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-8">
                      <FormInput id="botId" type="text" label="Bot id:"
                        value={this.state.botId} onChange={this.propertyChanged.bind(this)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <FormSelect id="granularity" options={Granularity} label="Granularity:"
                        value={this.state.granularity} onChange={this.propertyChanged.bind(this)}/>
                    </div>
                    <div className="col-md-4">
                      <FormSelect id="dimensions" options={Dimensions} label="Dimensions:"
                        value={this.state.dimensions} onChange={this.propertyChanged.bind(this)}/>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-3">
                  <FormInput id="dateFrom" type="text" label="From:"
                    value={DateService.toDisplayFormat(this.state.dateFrom)} onChange={this.propertyChanged.bind(this)}/>
                </div>
                <div className="col-md-3">
                  <FormInput id="dateTo" type="text" label="To:"
                    value={DateService.toDisplayFormat(this.state.dateTo)} onChange={this.propertyChanged.bind(this)}/>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>&nbsp;</label>
                    <button type="button" className="form-control btn btn-default" onClick={this.handlePrefetch.bind(this)}>Fetch ranges</button>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-lg btn-default">Search!</button>
            </form>
  }
}
