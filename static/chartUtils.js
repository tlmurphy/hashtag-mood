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
var tweetLinks = [];
values.length = 100;
labels.length = 100;
tweetLinks.length = 100;

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
      pointRadius: 3,
      fill: false
    }]
  },
  options: {
    onClick: graphClickEvent,
    responsive: true,
    layout: {
      padding: {
        right: 10
      }
    },
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
  fillDefault();
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
  fillDefault();
  tweetList.forEach(function(tweet) {
    labels.push(tweet.time);
    labels.shift();
    values.push(tweet.polarity);
    values.shift();
    tweetLinks.push(tweet.link);
    tweetLinks.shift();
  });
  window.myLine.update();
};

var updateDynamicChart = function (info) {
  config.options.title.text = "#" + hashtag;
  config.options.tooltips = false;
  values.push(info.polarity);
  values.shift();
  tweetLinks.push(info.link);
  tweetLinks.shift();
  window.myLine.update();
};

var getChartType = function (radios) {
  if (radios[0].checked) {
    return 'Static';
  } else {
    return 'Dynamic';
  }
};

var resetGraph = function () {
  fillDefault();
  window.myLine.update();
};

function fillDefault() {
  labels.fill(0);
  values.fill(0);
  tweetLinks.fill('');
}

function graphClickEvent(event, array) {
  if (array[0]) {
    const linkIndex = array[0]._index;
    var link = tweetLinks[linkIndex];
    var modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';
    twttr.widgets.createTweet(link.split('/').pop(), modalContent)
    .then(function (el) {
      var elem = document.querySelector('.modal');
      var instance = M.Modal.init(elem);
      instance.open();
    });
  }
}
