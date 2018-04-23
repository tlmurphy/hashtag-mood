'use strict';

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var values = [];
var labels = [];
values.length = 100;
labels.length = 100;

var config = {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      borderWidth: 2,
      lineTension: 0.25,
      pointRadius: 0,
      fill: false
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      fontSize: 20,
      text: ''
    },
    animation: {
      duration: 250 * 1.5,
      easing: 'linear'
    },
    legend: false,
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Time'
        },
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        ticks: {
          max: 1,
          min: -1
        },
        scaleLabel: {
          display: true,
          labelString: 'Polarity'
        }
      }]
    }
  }
};

var createChart = function () {
  var ctx = document.getElementById('line-chart').getContext('2d');
  labels.fill(0);
  values.fill(0);
  window.myLine = new Chart(ctx, config);
};

var updateChart = function (tweetList) {
  config.options.title.text = "#" + hashtag;
  config.options.tooltips = {
    mode: 'index',
    intersect: false
  };
  config.options.hover = {
    mode: 'nearest',
    intersect: true
  };
  config.data.datasets[0].label = 'polarity';
  config.data.datasets[0].pointRadius = 3;
  labels.fill(0);
  values.fill(0);
  tweetList.forEach(function(tweet) {
    var d = new Date(0);
    d.setUTCSeconds(tweet.time);
    labels.push(d);
    labels.shift();
    values.push(tweet.polarity);
    values.shift();
  });
  window.myLine.update();
};

var updateDynamicChart = function (info) {
  config.options.title.text = "#" + hashtag;
  config.options.tooltips = false;
  config.options.hover = false;
  config.data.datasets[0].pointRadius = 0;
  values.push(info.polarity);
  values.shift();
  window.myLine.update();
};

var getChartType = function (radios) {
  if (radios[0].checked) {
    return 'Static';
  } else {
    return 'Dynamic';
  }
};
