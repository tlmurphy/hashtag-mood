'use strict';

var hashtag;
var socket;
var graphActive = false;
var fromStatic = false;
var textChanged = false;

window.onload = function () {
  addTrends(document.getElementById('trends-dropdown'));
  var elem = document.querySelector('.dropdown-trigger');
  var instance = M.Dropdown.init(elem);
  createChart();
}

document.getElementById('get-mood').onclick = function () {
  var chartType = getChartType(document.getElementsByName('group1'));
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

document.querySelector('input').addEventListener('change', function () {
  textChanged = true;
});

window.addEventListener('beforeunload', function (event) {
  // If we don't disconnect the socket on a refresh, multiple threads can
  // be spawned due to how I'm handling threads in the server :')
  socket.disconnect();
});

var onClickTrend = function (trend) {
  hashtag = trend.slice(1);  // Removing the hashtag from the string
  document.querySelector("input").value = hashtag;
  M.updateTextFields();
  if (graphActive) {
    stopDynamicGraph();
  }
  handleStatic();
  fromStatic = true;
};

var addTrends = function (list) {
  fetch('/get-trends').then(function (response) {
    return response.json();
  })
  .then(function (body) {
    body.trends.forEach(function(t) {
      list.innerHTML += `<li><a class="light-blue-text" onclick=onClickTrend("${t}")>${t}</a></li>`;
    });
  });
}

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
    stopDynamicGraph();
  } else {
    graphActive = true;
    if (fromStatic || textChanged) {  // Only reset the graph if coming from a static graph or after a text input change
      resetGraph();
      fromStatic = false;
      textChanged = false;
    }
    socket = io({query: 'hashtag=' + hashtag});  // Use 127.0.0.1:5000 from flask
    socket.on('tweet', function (msg) {
      updateDynamicChart(msg);
    });
  }
};

var stopDynamicGraph = function () {
  socket.disconnect();
  var b = document.getElementById('get-mood');
  b.innerText = 'Get Mood';
  b.classList.remove('red');
  b.classList.add('orange');
  graphActive = false;
}
