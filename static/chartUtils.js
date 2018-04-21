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
values.fill(0);
labels.fill(0);
var speed = 250;

var staticConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'polarity',
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      data: [],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      fontSize: 20,
      text: ''
    },
    legend: {
      display: false
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
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
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Polarity'
        }
      }]
    }
  }
};

var dynamicConfig = {
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
    animation: {
      duration: speed * 1.5,
      easing: 'linear'
    },
    legend: false,
    scales: {
      xAxes: [{
        display: false
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
}

var createChart = function (body) {
  document.getElementById('chart-window').innerHTML = '<canvas id="line-chart" width="1000" height="600" class="chartjs-render-monitor"></canvas>';
  var ctx = document.getElementById('line-chart').getContext('2d');
  window.myLine = new Chart(ctx, staticConfig);
  updateChart(body);
}

var updateChart = function (tweetList) {
  staticConfig.options.title.text = "#" + hashtag;
  staticConfig.data.labels = [];
  staticConfig.data.datasets[0].data = [];
  tweetList.forEach(function(tweet) {
    var d = new Date(0);
    d.setUTCSeconds(tweet.time);
    staticConfig.data.labels.push(d);
    staticConfig.data.datasets[0].data.push(tweet.polarity);
  });
  window.myLine.update();
}

var createDynamicChart = function () {
  document.getElementById('chart-window').innerHTML = '<canvas id="line-chart" width="1000" height="600" class="chartjs-render-monitor"></canvas>';
  var ctx = document.getElementById('line-chart').getContext('2d');
  window.myLine = new Chart(ctx, dynamicConfig);
}

var updateDynamicChart = function (info) {
  values.push(info.polarity);
  values.shift();
  console.log(values);
  window.myLine.update();
}

var getChartType = function (radios) {
  if (radios[0].checked) {
    return 'Static'
  } else {
    return 'Dynamic'
  }
}
