/**
 * Fetch data from GitHub Stargazers API.
 * https://developer.github.com/v3/activity/starring/#list-stargazers
 * Data structure: [
 *   {day: '01-01-16', number: 10}
 *   {day: '01-02-16', number: 10}
 * ]
 */
var fs = require('fs');
var req = require('superagent');
var superagentPromisePlugin = require('superagent-promise-plugin');
var Url = require('urlgray');

superagentPromisePlugin.Promise = Promise;

var url = Url('https://api.github.com/repos/aframevr/aframe/stargazers').q({
  access_token: '',
  per_page: 100
});

req
  .get(url.toString())
  .set('User-Agent', 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)')
  .use(superagentPromisePlugin)
  .then(function (res) {
    // Get number of pages.
    var numPages = res.headers.link.match(/page=(\d+)>; rel="last"/)[1];

    // Fetch every page of data.
    var rawData = {};
    var promises = [];
    for (var i = 1; i <= parseInt(numPages); i++) {
      var pageDataReq = req
        .get(url.q('page', i).toString())
        .set('User-Agent', 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)')
        .use(superagentPromisePlugin)
        .set('Accept', 'application/vnd.github.v3.star+json')
        .then(function (res) {
          res.body.forEach(function getData (stargazer) {
            var date = stargazer.starred_at.slice(0, 10);
            if (rawData[date]) {
              rawData[date]++;
            } else {
              rawData[date] = 1;
            }
          });
        }, console.log);
      promises.push(pageDataReq);
    }

    // Process and set data.
    Promise.all(promises).then(function () {
      fs.writeFileSync('data/githubStargazersPerDay.json', JSON.stringify(rawData));
    });
  }, console.log);
