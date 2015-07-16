import _      from 'lodash';
import moment from 'moment';
import React  from 'react';
import d3     from 'd3';
import rd3c   from 'react-d3-components';

export default class Chart extends React.Component {

  constructor(props){
    super(props)
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props){
    let from = new Date(props.data.description['effective-from']);
    let to   = new Date(props.data.description['effective-to']);

    return {
      xScale      : d3.time.scale().domain([ from, to ]).range([0, 1000]),
      xScaleBrush : d3.time.scale().domain([ from, to ]).range([0, 1000])
    };
  }

  prepareData(raw) {
    // Prepare scale
    let from       = moment(raw.description['effective-from']);
    let to         = moment(raw.description['effective-to']);
    let g          = raw.description.granularity;
    let timestamps = [];

    while(from.isBefore(to)){
      timestamps.push(+from)
      from.add(1, g)
    }

    // Prepare data for graph
    let data = {}

    _.forEach(raw.description.bots, function(key, index){
      data[key] = [];
    });

    _.forEach(raw.description.bots, function(key, index){
      _.forEach(raw.description.dimensions, function(dimension, index){
        data[key].push({
          label: dimension,
          values: _(timestamps)
          .map(function(ts, index){
            return {
              x: ts,
              y: raw.stats[key][dimension][index]
            }
          })
          .filter(function(obj){
            return obj.y !== undefined;
          })
          .value()
        })
      });
    });

    return data;

  }

  prepareRawData(){
    // this.props.data = {'description':{'effective-from':'2015-02-10T16:00:00.000Z','from':'2015-02-10T16:44:00.000Z','to':'2015-02-11T11:14:00.000Z','effective-to':'2015-02-11T11:00:00.000Z','granularity':'hours','dimensions':['accepted'],'bots':['54c7c8bb7365df0300d56bcd']},'stats':{'54c7c8bb7365df0300d56bcd':{'accepted':[1864,431,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}}}
    return this.prepareData(this.props.data);
  }

  render() {
    let data = this.prepareRawData()

    let from = new Date(this.props.data.description['effective-from']);
    let to   = new Date(this.props.data.description['effective-to']);

    // Assuming no more than one bot is always queried
    data = data[_.first(_.values(this.props.data.description.bots))]

    let tooltipProcessor = function(y, yAccum, xIndex){
      let x = moment(data[0].values[xIndex].x).format('dddd, MMMM Do YYYY, h:mm:ss a');

      let dataByDimensions = _.indexBy(data, 'label');

      let dimensionContent = [];
      _.forEach(this.props.data.description.dimensions, function(dimension){
        if (!_.isEmpty(dataByDimensions[dimension]) && !_.isEmpty(dataByDimensions[dimension].values[xIndex])){
          dimensionContent.push(<br />);
          dimensionContent.push(<div>{dimension + ': ' + dataByDimensions[dimension].values[xIndex].y}</div>);
        }
      })

      return  <div className="bs-tooltip tooltip right">
                <div className="tooltip-arrow"></div>
                <div className="tooltip-inner">
                  {x}
                  {dimensionContent}
                </div>
              </div>
    }

    // tickFormat: d3.time.format('%m/%d/%y - %H:%M')
    return  <div className='linechart'>
              <rd3c.AreaChart
                data        = {data}
                width       = {1200}
                height      = {300}
                margin      = { {top: 10, bottom: 50, left: 50, right: 20} }
                yAxis       = {{ label: 'Total' }}
                xAxis       = {{ label: 'Time', tickValues: this.state.xScale.ticks(d3.time.hour, 5), tickFormat: d3.time.format('%H:%M') }}
                xScale      = {this.state.xScale}
                tooltipHtml = {tooltipProcessor.bind(this)}
                title       = 'Line Chart' />
              <div className="brush" style={{float: 'none'}}>
                <rd3c.Brush
                  width    = {1200}
                  height   = {50}
                  margin   = {{top: 0, bottom: 30, left: 50, right: 20}}
                  xScale   = {this.state.xScaleBrush}
                  extent   = {[ from, to ]}
                  onChange = {this.onScaleChange.bind(this)}
                  xAxis    = {{tickValues: this.state.xScaleBrush.ticks(d3.time.day, 2), tickFormat: d3.time.format("%m/%d")}} />
              </div>
            </div>
  }

  onScaleChange(extent){
    this.setState({
      xScale: d3.time.scale().domain([ new Date(extent[0]), new Date(extent[1]) ]).range([0, 1000])
    });
  }

}
