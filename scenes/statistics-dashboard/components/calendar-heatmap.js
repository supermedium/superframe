var d3 = require('d3');
window.d3 = d3;

var DATE_FORMAT = d3.timeFormat('%Y-%m-%d');

AFRAME.registerComponent('calendar-heatmap', {
  schema: {
    colors: {type: 'array', default: ['#F7F6DE', '#EFD510', '#FA7E0A', '#8F0E0E', '#530C0C']},
    json: {default: ''},
    dayMargin: {default: 0.05},
    monthMargin: {default: .09},
    scaleY: {default: 0.02},
    size: {default: 0.03},
    yearMargin: {default: 0.75}
  },

  init: function () {
    d3.json('data/githubStargazersPerDay.json', this.generate.bind(this));
  },

  generate: function (err, json) {
    var data = this.data;
    var el = this.el;

    var year = d3.select(el)
      .selectAll('.year')
      .data(d3.range(2015, 2017))
      .enter()
      .append('a-entity')
      .attr('data-year', function (datum, i) { return datum; })
      .attr('position', function (datum, i) {
        return {
          x: 0,
          y: 0,
          z: i * data.yearMargin
        };
      })

    d3.selectAll('.year')
      .enter()
      .append('a-entity')
      .attr('geometry', {
        primitive: 'box',
        depth: 2,
        height: .01,
        width: 10
      })
      .attr('material', {
        color: 'brown'
      });

    var colorRangers = {};
    [2015, 2016].forEach(function (year) {
      var yearValues = Object.keys(json).filter(function (dateStr) {
        return dateStr.startsWith(year.toString());
      }).map(function (dateStr) {
        return json[dateStr];
      });
      var maxForYear = Math.max.apply(null, yearValues);
      colorRangers[year] = d3.scaleQuantile().domain([0, maxForYear]).range(data.colors);
    });

    var bars = year.selectAll('.day')
      .data(function (year) {
        return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));
      })
      .enter()
      .append('a-entity')
      .datum(DATE_FORMAT)
      .attr('position', function (dateStr) {
        date = new Date(dateStr);
        var dayOfWeek = date.getDay();
        var weekOfYear = parseInt(d3.timeFormat('%W')(date));
        var month = date.getMonth();
        return {
          x: weekOfYear * (data.size + data.dayMargin) + (month * data.monthMargin),
          y: json[dateStr] ? (json[dateStr] * data.scaleY / 2) : 0,
          z: dayOfWeek * (data.size + data.dayMargin)
        };
      })
      .attr('geometry', function (dateStr) {
        return {
          primitive: 'box',
          depth: data.size,
          height: json[dateStr] ? json[dateStr] * data.scaleY : .005,
          width: data.size
        };
      })
      .attr('material', function (dateStr) {
        var year = new Date(dateStr).getFullYear();
        return {
          color: json[dateStr] ? colorRangers[year](json[dateStr]) : 'black',
          opacity: json[dateStr] ? 1 : 0.25,
          metalness: 0.3,
          roughness: 0
        };
      });

    el.emit('calendar-heatmap-generated');
  }
});
