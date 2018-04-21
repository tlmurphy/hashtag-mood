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

document.getElementById('stream-test').onclick = function () {
  fetch('/stream-test')
    // Retrieve its body as ReadableStream
  .then(response => response.body)
  .then(rs => {
    const reader = rs.getReader();
    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          // When no more data needs to be consumed, break the reading
          if (done) {
            break;
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
        }
        // Close the stream
        controller.close();
        reader.releaseLock();
      }
    })
  })
  // Create a new response out of the stream
  .then(rs => new Response(rs))
  .then(response => console.log(response))
  .catch(console.error);
};
