'use strict';

document.getElementById('getMood').onclick = function () {
  var hashtag = document.getElementById('hashtag').value;
  const params = { hashtag: hashtag };
  const urlParams = new URLSearchParams(Object.entries(params));
  fetch('/get-mood?' + urlParams).then(function (response) {
    return response.json();
  })
  .then(function (body) {
    console.log(body);
    var lineChart = document.getElementById('lineChart');
    if (lineChart) {
      randomizeData();
    } else {
      createChart();
    }
    updateHashtagResults();
  });
};

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var config = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: window.chartColors.red,
      borderColor: window.chartColors.red,
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
      ],
      fill: false,
    }, {
      label: 'My Second dataset',
      fill: false,
      backgroundColor: window.chartColors.blue,
      borderColor: window.chartColors.blue,
      data: [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
      ],
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Example Chart'
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
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    }
  }
};

var createChart = function () {
  document.getElementById('chartPlace').innerHTML = '<canvas id="lineChart" width="800" height="600" class="chartjs-render-monitor"></canvas>';
  var ctx = document.getElementById('lineChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
}

var randomizeData = function () {
  config.data.datasets.forEach(function(dataset) {
    dataset.data = dataset.data.map(function() {
      return randomScalingFactor();
    });
  });
  window.myLine.update();
}

var updateHashtagResults = function () {
  var resultString = 'Polarity = ' + body['polarity'] + '<br> Subjectivity = ' + body['subjectivity'];
  document.getElementById('hashtagResult').innerHTML = resultString;
}

// Everything below this is left over example from chart.js that might come in handly later idk
// var colorNames = Object.keys(window.chartColors);
// document.getElementById('addDataset').addEventListener('click', function() {
//   var colorName = colorNames[config.data.datasets.length % colorNames.length];
//   var newColor = window.chartColors[colorName];
//   var newDataset = {
//     label: 'Dataset ' + config.data.datasets.length,
//     backgroundColor: newColor,
//     borderColor: newColor,
//     data: [],
//     fill: false
//   };
//
//   for (var index = 0; index < config.data.labels.length; ++index) {
//     newDataset.data.push(randomScalingFactor());
//   }
//
//   config.data.datasets.push(newDataset);
//   window.myLine.update();
// });
//
// document.getElementById('addData').addEventListener('click', function() {
//   if (config.data.datasets.length > 0) {
//     var month = MONTHS[config.data.labels.length % MONTHS.length];
//     config.data.labels.push(month);
//
//     config.data.datasets.forEach(function(dataset) {
//       dataset.data.push(randomScalingFactor());
//     });
//
//     window.myLine.update();
//   }
// });
//
// document.getElementById('removeDataset').addEventListener('click', function() {
//   config.data.datasets.splice(0, 1);
//   window.myLine.update();
// });
//
// document.getElementById('removeData').addEventListener('click', function() {
//   config.data.labels.splice(-1, 1); // remove the label first
//
//   config.data.datasets.forEach(function(dataset) {
//     dataset.data.pop();
//   });
//
//   window.myLine.update();
// });
