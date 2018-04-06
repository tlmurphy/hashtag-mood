// I am so ass at js it's not even funny
document.getElementById('getMood').onclick = function () {
  var hashtag = document.getElementById('hashtag').value;
  const params = { hashtag: hashtag };
  const urlParams = new URLSearchParams(Object.entries(params));
  fetch('/get-mood?' + urlParams).then(function (response) {
    return response.json();
  })
  .then(function (body) {
    console.log(body);
    var resultString = 'Polarity = ' + body['polarity'] + '<br> Subjectivity = ' + body['subjectivity'];
    document.getElementById('hashtagResult').innerHTML = resultString;
  });
};
