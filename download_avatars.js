console.log('Running file');
require('dotenv').config();

let request = require('request');
let async = require('async');
let fetch = require('node-fetch');
let key = process.env.GITHUB_TOKEN;
let fs = require('fs');
let owner = process.argv[2];
let repo = process.argv[3];
let filepath = './avatars/';

// get API
function getRepoContributors(repoOwner, repoName, cb) {
  let options = {
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
        let body = JSON.parse(raw);
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

function downloadImageByURL(url, filePath) {

  request.get(url)
         .pipe(fs.createWriteStream(filePath))

}

var arr = [];

let starred = function(err, result) {
  if(err) {
    console.log('Errors: ', err);
  }

  for (let i = 0; i < result.length; i ++) {
        var login = result[i].login;
        var url = `https://api.github.com/users/${login}/starred`;
        var headers = { 'User-Agent': 'request', Authorization: 'token ' + key};

  const getData = async (url, headers) => {
    try {
      const response = await fetch(url, {headers: headers});
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  var run = async () => {
    var result = await getData(url, headers);
    var starredurlname = [];
    for (let j = 0; j < result.length; j ++) {
      starredurlname.push(result[j].full_name);
    }
    return starredurlname;
  };
arr = arr.concat(run().then((arr) => console.info(arr)));
};
console.log(arr);
}



// print avatar url
// let cb1 = function(err, result) {
//   if(err) {
//     console.log('Errors: ', err);
//   }
//   for(let i = 0; i < result.length; i ++) {
//   console.log('Result: ', result[i].avatar_url);
//   }
// };


// save image in avatars folder
let cb2 = function(err, result) {
  if(err) {
    console.log('Errors: ', err);
  }

  if(!fs.existsSync(filepath)) {
    return console.log('Errors: filePath is missing');
  }

  for(let i = 0; i < result.length; i ++) {
   downloadImageByURL(result[i].avatar_url, filepath + result[i].login + '.png');
  }

}

getRepoContributors(owner, repo, starred);







