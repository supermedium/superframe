var SpotifyWebApi = (function() {

  'use strict';
  var _baseUri = 'https://api.spotify.com/v1';
  var _baseTokenUri = 'https://spotify-web-api-token.herokuapp.com';
  var _accessToken = null;

  var _promiseProvider = function(promiseFunction) {
    return new window.Promise(promiseFunction);
  };

  var _checkParamsAndPerformRequest = function(requestData, options, callback) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }
    _extend(requestData.params, opt);
    return _performRequest(requestData, cb);
  };

  var _performRequest = function(requestData, callback) {
    var promiseFunction = function(resolve, reject) {
      var req = new XMLHttpRequest();
      var type = requestData.type || 'GET';
      if (type === 'GET') {
        req.open(type,
          _buildUrl(requestData.url, requestData.params),
          true);
      } else {
        req.open(type, _buildUrl(requestData.url));
      }
      if (_accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
      }
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {}

          if (req.status === 200 || req.status === 201) {
            if (resolve) {
              resolve(data);
            }
            if (callback) {
              callback(null, data);
            }
          } else {
            if (reject) {
              reject(req);
            }
            if (callback) {
              callback(req, null);
            }
          }
        }
      };

      if (type === 'GET') {
        req.send(null);
      } else {
        req.send(JSON.stringify(requestData.postData));
      }
    };

    if (callback) {
      promiseFunction();
      return null;
    } else {
      return _promiseProvider(promiseFunction);
    }
  };

  var _extend = function() {
    var args = Array.prototype.slice.call(arguments);
    var target = args[0];
    var objects = args.slice(1);
    target = target || {};
    for (var i = 0; i < objects.length; i++) {
      for (var j in objects[i]) {
        target[j] = objects[i][j];
      }
    }
    return target;
  };

  var _buildUrl = function(url, parameters){
    var qs = '';
    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    }
    if (qs.length > 0){
      qs = qs.substring(0, qs.length - 1); //chop off last '&'
      url = url + '?' + qs;
    }
    return url;
  };

  var Constr = function() {};

  Constr.prototype = {
    constructor: SpotifyWebApi
  };

  /**
   * Sets the access token to be used.
   * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
   * the Spotify Developer site for more information about obtaining an access token.
   * @param {string} accessToken The access token
   * @return {void}
   */
  Constr.prototype.setAccessToken = function(accessToken) {
    _accessToken = accessToken;
  };

  /**
   * Fetches tracks from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchTracks = function(query, options, callback) {
    var requestData = {
      url: _baseUri + '/search/',
      params: {
        q: query,
        type: 'track'
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get audio features for a single track identified by its unique Spotify ID.
   * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
    var requestData = {
      url: _baseUri + '/audio-features/' + trackId
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Obtains a token to be used against the Spotify Web API
   */
  Constr.prototype.getToken = function(callback) {
    var requestData = {
      url: _baseTokenUri + '/token'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  return Constr;
})();
