import React from 'react';
import Granularity from '../enums/granularity';
import Dimentions from '../enums/dimentions';


class FormInput extends React.Component {

  render() {
    return <div className="form-group">
             <label htmlFor={this.props.id}>{this.props.label}</label>
             <input type={this.props.type} className="form-control" id={this.props.id} />
           </div>
  }
}

class FormSelect extends React.Component {

  render() {
    return <div className="form-group">
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <select id={this.props.id} multiple>
              {
                Object.keys(this.props.options).map((k) => {
                  return <option value={k}>{this.props.options[k]}</option>
                })
              }
            </select>
           </div>
  }
}



export default class SearchForm extends React.Component {

  _getFormData(form, values) {
    data = {}

    values.forEach((id) => {
      data[id] = e.target[id].value
    })

    return data;
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
    return  <form onSubmit={this.handleSubmit} role="form">
              <span>{this.state.status.message}</span>
              <FormInput id="botId" type="text" label="Bot id:"/>
              <FormSelect id="granularity" options={Granularity} label="Granularity:"/>
              <FormSelect id="dimentions" options={Dimentions} label="Dimentions:"/>
              <FormInput id="from" type="date" label="From:"/>
              <FormInput id="to" type="date" label="To:"/>
              <button type="submit" class="btn btn-default">Submit</button>
            </form>
  }
}
