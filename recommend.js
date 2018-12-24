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
function getRepoContributors(repoOwner, repoName) {
  let options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      Authorization: 'token ' + key
    }
  };

  return new Promise(function (resolve, reject) {
  if(!repoOwner || !repoName) {
    return reject('Errors: incorrect number of arguments given')
  }
  if(!fs.existsSync('.env')) {
    return reject('Errors: .env is missing');
  }

    request(options, function(err, res, raw) {
      if(err === null && res.statusCode === 200) {
        let body = JSON.parse(raw);
        resolve(body.map( x => x.login));
      }
      else if(res.statusCode === 404) {
        reject('Invalid url');
      }
      else if(res.statusCode === 401) {
        const stats = fs.statSync('.env');
        const size = stats.size
        if(size === 0) {
          reject('Key info is missing');
        }
        else {
         reject('Invalid key');
        }
      }
      });

  })
}


//all starred url find
let starred = async function(usernames) {
  var arr = [];
  for (let i = 0; i < usernames.length; i ++) {
    var login = usernames[i];
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
    var result = await getData(url, headers);
    for (let j = 0; j < result.length; j ++) {
      arr.push(result[j].full_name);
    }
  }
  return arr;
}


getRepoContributors(owner, repo)
  .then((usernames) => {
    // console.info(usernames)
    return starred(usernames)
  })
  .then((fullnames) => {
    // console.info(fullnames)
    var tmp = {}, tops = [];
    // Create object with count of occurances of each array element
    fullnames.forEach(function(item) {
        tmp[item] = tmp[item] ? tmp[item]+1 : 1;
    });
    // Create an array of the sorted object properties
    tops = Object.keys(tmp).sort(function(a, b) { return tmp[b] - tmp[a] });
    // Print top 5 starred url
    for (let i = 0; i < 5; i ++){
    console.info(`[${tmp[tops[i]]} stars]`, tops[i]);
    }
  })
  .catch((erros) => console.info(erros))







