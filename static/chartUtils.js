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

var config = {
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

var updateChart = function (tweetList) {
  config.options.title.text = "#" + hashtag;
  config.data.labels = [];
  config.data.datasets[0].data = [];
  tweetList.forEach(function(tweet) {
    var d = new Date(0);
    d.setUTCSeconds(tweet.time);
    config.data.labels.push(d);
    config.data.datasets[0].data.push(tweet.polarity);
  });
  window.myLine.update();
}

var createChart = function (body) {
  document.getElementById('chart-window').innerHTML = '<canvas id="line-chart" width="1000" height="600" class="chartjs-render-monitor"></canvas>';
  var ctx = document.getElementById('line-chart').getContext('2d');
  window.myLine = new Chart(ctx, config);
  updateChart(body);
}

var updateData = function (tweetList) {
  config.data.datasets.forEach(function(dataset) {
    dataset.data = dataset.data.map(function() {
      return randomScalingFactor();
    });
  });
  window.myLine.update();
}
