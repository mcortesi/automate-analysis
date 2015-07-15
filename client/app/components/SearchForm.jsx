import React from 'react';

import Granularity from '../enums/granularity';
import Dimentions from '../enums/dimentions';


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
                  return <option value={k}>{this.props.options[k]}</option>
                })
              }
            </select>
           </div>
  }

  onChange(e) {
    this.props.onChange(this.props.id, e.target.value);
  }

}



export default class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
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

  render() {
    return  <form role="form" onSubmit={this.handleSubmit.bind(this)}>

              <FormInput id="botId" type="text" label="Bot id:"
                value={this.state.botId} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="granularity" options={Granularity} label="Granularity:"
                value={this.state.granularity} onChange={this.propertyChanged.bind(this)}/>

              <FormSelect id="dimentions" options={Dimentions} label="Dimentions:"
                value={this.state.dimentions} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="from" type="date" label="From:"
                value={this.state.from} onChange={this.propertyChanged.bind(this)}/>

              <FormInput id="to" type="date" label="To:"
                value={this.state.to} onChange={this.propertyChanged.bind(this)}/>

              <button type="submit" class="btn btn-default">Submit</button>
            </form>
  }
}
