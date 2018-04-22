'use strict';

var hashtag;
var socket;
var graphActive = false;
var fromStatic = false;

createChart();

document.getElementById('get-mood').onclick = function () {
  var chartType = getChartType(document.getElementsByName('group1'))
  hashtag = document.getElementById('hashtag').value;
  if (chartType === 'Static' && !graphActive) {
    handleStatic();
    fromStatic = true;
  } else {
    var b = document.getElementById('get-mood');
    b.innerText = 'Stop';
    b.classList.remove('orange');
    b.classList.add('red');
    handleDynamic();
  }
};

window.addEventListener("beforeunload", function (event) {
  // If we don't disconnect the socket on a refresh, multiple threads can
  // be spawned due to how I'm handling threads in the server :')
  socket.disconnect();
});

var handleStatic = function () {
  const params = { hashtag: hashtag };
  const urlParams = new URLSearchParams(Object.entries(params));
  fetch('/get-mood?' + urlParams).then(function (response) {
    return response.json();
  })
  .then(function (body) {
    updateChart(body);
  });
};

var handleDynamic = function () {
  if (graphActive) {
    socket.disconnect();
    var b = document.getElementById('get-mood');
    b.innerText = 'Get Mood';
    b.classList.remove('red');
    b.classList.add('orange');
    graphActive = false;
  } else {
    graphActive = true;
    if (fromStatic) {
      values.fill(0);
      labels.fill(0);
      fromStatic = false;
    }
    socket = io({query: 'hashtag=' + hashtag});  // Use 127.0.0.1:5000 from flask
    socket.on('tweet', function (msg) {
      updateDynamicChart(msg);
    });
  }
}
