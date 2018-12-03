var request = require('request');
var key = require('./secrets');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization: 'token ' + key.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, raw) {
    var body = JSON.parse(raw);
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if(err) {
    console.log("Errors: ", err);
  }
  for(var i = 0; i < result.length; i ++) {
  console.log("Result: ", result[i].avatar_url);
  }
});