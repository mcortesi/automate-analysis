import React from 'react';


export default class BotList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bots: [{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      },{
        name: 'Bot1',
        id: '54c7c8bb7365df0300d56bcd'
      }]
    };
  }

  handleBotSelection(e) {
    debugger
    this.props.onBotSelected(e.currentTarget.dataset.bot);
  }

  render() {
    return <div className="bot-list">
             <ul>
               {this.state.bots.map ((b) => {
                 return <li data-bot={b.id} onClick={this.handleBotSelection.bind(this)}>{b.name}, {b.id}</li>
               })}
             </ul>
           </div>
  }

}
