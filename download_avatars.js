console.log('Running file');
require('dotenv').config();

var request = require('request');
var urlExists = require('url-exists');
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

  if(arguments.length !== 3) {
    return console.log('Errors: incorrect number of arguments given')
  }

  if(!fs.existsSync('.env')) {
    return console.log('Errors: .env is missing');
  }



    request(options, function(err, res, raw) {

      if(err === null && res.statusCode === 200) {
        var body = JSON.parse(raw);
        cb(err, body);
      }
      else if(res.statusCode === 404) {
        console.log('Invalid url');
      }
      else if(res.statusCode === 401) {
        const stats = fs.statSync('.env');
        const size = stats.size
        if(size === 0) {
          console.log('Key info is missing');
        }
        else {
        console.log('Invalid key');
        }
      }


    });

}

// print avatar url
// var cb1 = function(err, result) {
//   if(err) {
//     console.log('Errors: ', err);
//   }
//   for(var i = 0; i < result.length; i ++) {
//   console.log('Result: ', result[i].avatar_url);
//   }
// };

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




