console.log('Running file');
require('dotenv').config();

var request = require('request');
var key = process.env.GITHUB_TOKEN;
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];
var filepath = './avatars/';

// get API
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      Authorization: 'token ' + key
    }
  };

  if(!fs.existsSync(key)) {
    return console.log('Errors: .env is missing');
  }

  if(!fs.)

  if(!fs.existsSync(options.url)) {
    return console.log('Errors: url is missing');
  }

  // if(!response || response != 200) {
  //   console.log('Errors', )
  // }

  request(options, function(err, res, raw) {
    var body = JSON.parse(raw);
    cb(err, body);
  });
}

// print avatar url
var cb1 = function(err, result) {
  if(err) {
    console.log('Errors: ', err);
  }
  for(var i = 0; i < result.length; i ++) {
  console.log('Result: ', result[i].avatar_url);
  }
};

// save image in avatars folder
var cb2 = function(err, result) {
  if(err) {
    console.log('Errors: ', err);
  }

  if(!fs.existsSync(filepath)) {
    return console.log('Errors: filePath is missing');
  }

  for(var i = 0; i < result.length; i ++) {
   downloadImageByURL(result[i].avatar_url, filepath + result[i].login + '.png');
  }
}

getRepoContributors(owner, repo, cb2);



function downloadImageByURL(url, filePath) {

  request.get(url)
         .pipe(fs.createWriteStream(filePath))

}




