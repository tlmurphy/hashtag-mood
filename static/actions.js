'use strict';

var hashtag;
var socket;
var graphActive = false;

document.getElementById('get-mood').onclick = function () {
  var chartType = getChartType(document.getElementsByName('group1'))
  hashtag = document.getElementById('hashtag').value;
  if (chartType === 'Static') {
    buildStaticChart();
  } else {
    var b = document.getElementById('get-mood');
    b.innerText = 'Stop';
    b.classList.remove('orange');
    b.classList.add('red');
    buildDynamicChart();
  }
};

var buildStaticChart = function () {
  const params = { hashtag: hashtag };
  const urlParams = new URLSearchParams(Object.entries(params));
  fetch('/get-mood?' + urlParams).then(function (response) {
    return response.json();
  })
  .then(function (body) {
    console.log(body);
    var lineChart = document.getElementById('line-chart');
    if (lineChart) {
      updateChart(body);
    } else {
      createChart(body);
    }
  });
}

var buildDynamicChart = function () {
  if (graphActive) {
    socket.disconnect();
    var b = document.getElementById('get-mood');
    b.innerText = 'Get Mood';
    b.classList.remove('red');
    b.classList.add('orange');
    graphActive = false;
  } else {
    graphActive = true;
    socket = io({query: 'hashtag=' + hashtag});  // Use 127.0.0.1:5000 from flask
    createDynamicChart();
    socket.on('tweet', function (msg) {
      updateDynamicChart(msg);
    });
  }
}
