'use strict';

/**
 * @ngdoc service
 * @name eversnapApp.services.Album
 * @description
 * Service in the eversnapApp.services that allows album and photo fetch.
 *
 * @requires Facebook
 * @requires AccessToken
 * @requires $q
 */
angular.module('eversnapApp.services')
  .factory('Album', AlbumService);

AlbumService.$inject = ['Facebook', 'AccessToken', '$q'];

function AlbumService(Facebook, AccessToken, $q) {

  var albums = {};

  return {
    fetch: fetchAlbum,
    fetchPhotos: fetchPhotos,
    destroy: destroy,
    get: getAlbum
  };

  function fetchAlbum(profileId) {
    var deferred = $q.defer();

    if(profileId)
      Facebook.api('/' + profileId + '/albums',
        function (response) {
          if (response && !response.error) {
            albums = response;
            deferred.resolve(albums);
          }
          else {
            console.error(response.error);
            deferred.reject(response.error);
          }
        });
    else
      deferred.reject('No profile id provided');

    return deferred.promise;
  }

  function fetchPhotos(id) {
    var deferred = $q.defer();

    if(!id)
      deferred.reject('id required');

    Facebook.api('/' + id + '/photos?access_token=' + AccessToken.get(), function(response) {
      deferred.resolve(response);
    });

    return deferred.promise;
  }

  function destroy() {
    albums = {};
    return albums;
  }

  function searchById(id) {
    for(var i = 0; i < albums.data.length; i++) {
      if(albums.data[i].id === id) {
        return albums.data[i];
      }
    }
    return null;
  }

  function getAlbum(id) {
    return id ? searchById(id) : albums;
  }
}
