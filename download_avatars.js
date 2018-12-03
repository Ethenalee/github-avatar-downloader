var request = require('request');
var key = require('./secrets');
var fs = require('fs');

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

var cb = function(err, result) {
  if(err) {
    console.log("Errors: ", err);
  }
  for(var i = 0; i < result.length; i ++) {
  console.log("Result: ", result[i].avatar_url);
  }
};


var cb2 = function(err, result) {
  var url = [];
  for(var i = 0; i < result.length; i ++) {
   downloadImageByURL(result[i].avatar_url, './avatars/' + result[i].login + '.png');
  }
}

getRepoContributors("jquery", "jquery", cb2);



function downloadImageByURL(url, filePath) {
  request.get(url)
       .pipe(fs.createWriteStream(filePath))

}




