import _      from 'lodash';
import moment from 'moment';
import React  from 'react';
import d3     from 'd3';
import rd3    from 'react-d3';

export default class Chart extends React.Component {

  prepareData(raw) {
    console.log('RAW', raw);

    // Prepare scale
    let from       = moment(raw.description['effective-from']);
    let to         = moment(raw.description['effective-to']);
    let g          = raw.description.granularity;
    let timestamps = [];

    while(from.isBefore(to)){
      timestamps.push(+from)
      from.add(1, g)
    }

    console.log('ts', timestamps);

    // Prepare data for graph
    let data = []
    _.forEach(raw.description.bots, function(key, index){
      console.log(key, index);
      data.push({
        name: 'Bot ' + key,
        values: _(timestamps)
        .map(function(ts, index){
          return {
            x: ts,
            y: raw.stats[key].accepted[index]
          }
        })
        .filter(function(obj){
          return obj.y !== undefined;
        })
        .value()
      })
    });

    return data;

  }

  render() {

    let data = this.prepareData(this.props.data)

    console.log('DATA', data);

    return  <rd3.LineChart legend={true} data={data} width={1200} height={300} title="Line Chart" />
  }
}

// let d3Chart = {
//   _scales : function(el, domain) {
//     if (!domain) {
//       return null;
//     }

//     let width = el.offsetWidth;
//     let height = el.offsetHeight;

//     let x = d3.scale.linear()
//       .range([0, width])
//       .domain(domain.x);

//     let y = d3.scale.linear()
//       .range([height, 0])
//       .domain(domain.y);

//     let z = d3.scale.linear()
//       .range([5, 20])
//       .domain([1, 10]);

//     return {x: x, y: y, z: z};
//   },

//   create : function(el, props, state) {
//     let svg = d3.select(el).append('svg')
//         .attr('class', 'd3')
//         .attr('width', props.width)
//         .attr('height', props.height);

//     svg.append('g').attr('class', 'd3-lines');

//     this.update(el, state);
//   },

//   update : function(el, state) {
//     // Re-compute the scales, and render the data points
//     let scales = this._scales(el, state.domain);
//     this._drawPoints(el, scales, state.data);
//   },

//   destroy: function(el) {
//     // Any clean-up would go here
//     // in this example there is nothing to do
//   },

//   _drawPoints: function(el, scales, data) {
//     console.log('DATA', data);
//     let g = d3.select(el).selectAll('.d3-lines');

//     let line = d3.svg.line()
//     .x(function(d){ return d.x; })
//     .y(function(d){ return d.y; })
//     .interpolate("linear");

//     let d3Line = g.selectAll('.d3-line')
//     .data(data, function(d) { console.log(1, d);return d; });

//     // ENTER
//     d3Line.enter()
//     .append('path')
//     .attr("stroke", "red")
//     .attr('class', 'd3-line');

//     // ENTER & UPDATE
//     d3Line
//       .transition()
//       .ease("linear")
//       .duration(1000)
//       .attr("d", function (d) { return line(d.values); });

//     // EXIT
//     d3Line.exit().remove();
//   }
// };

// export default class Chart extends React.Component {

//   getChartState() {
//     return {
//       data: this.props.data,
//       domain: this.props.domain
//     };
//   }

//   componentDidMount() {
//     let el = React.findDOMNode(this);
//     d3Chart.create(el, {
//       width: '100%',
//       height: '300px'
//     }, this.getChartState());
//   }

//   componentDidUpdate() {
//     let el = React.findDOMNode(this);
//     d3Chart.update(el, this.getChartState());
//   }

//   componentWillUnmount() {
//     let el = React.findDOMNode(this);
//     d3Chart.destroy(el);
//   }

//   render() {
//     return  <div className="Chart"></div>
//   }
// }






/**
class Line extends React.Component {
  getDefaultProps() {
    return {
      path: '',
      color: 'blue',
      width: 2
    }
  }

  render() {
    return <path d={this.props.path} stroke={this.props.color} strokeWidth={this.props.width} fill="none" />
  }
}

class DataSeries extends React.Component {
  getDefaultProps() {
    return {
      title: '',
      data: [],
      interpolate: 'linear'
    }
  }

  render() {
    let self = this;
    let props = this.props;
    let yScale = props.yScale,
    let xScale = props.xScale;

    let path = d3.svg.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); })
    .interpolate(this.props.interpolate);

    return <Line path={path(this.props.data)} color={this.props.color} />
  }
}
*/
