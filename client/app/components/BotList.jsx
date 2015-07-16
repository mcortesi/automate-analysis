import React from 'react';


export default class BotList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bots: this.props.bots
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      bots: nextProps.bots
    });
  }

  handleBotSelection(e) {
    this.props.onBotSelected(e.currentTarget.dataset.bot);
  }

  render() {
    let list = null;

    if(this.state.bots) {
      list = this.state.bots.map ((b) => {
        return <li data-bot={b._id} onClick={this.handleBotSelection.bind(this)}>{b.name}, {b._id}</li>
      })
    } else {
      list = <li>No data</li>
    }

    return <div className="bot-list">
             <ul>
               {list}
             </ul>
           </div>
  }

}
