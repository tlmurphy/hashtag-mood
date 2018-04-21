'use strict';

var hashtag;

document.getElementById('get-mood').onclick = function () {
  hashtag = document.getElementById('hashtag').value;
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
};
