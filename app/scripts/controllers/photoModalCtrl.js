'use strict';

/**
 * @ngdoc function
 * @name eversnapApp.controller:ModalInstanceCtrl
 * @description
 * Controller of the eversnapApp.controllers
 * Load and display image and comments.
 *
 * @requires $modalInstance
 * @requires photoId
 * @requires Facebook
 * @requires AccessToken
 */
angular.module('eversnapApp.controllers')
  .controller('ModalInstanceCtrl', PhotoModalCtrl);

function PhotoModalCtrl($modalInstance, photoId, Facebook, AccessToken) {
  /* jshint validthis: true */
  var vm = this;

  vm.photoId = photoId;
  vm.access_token = AccessToken.get();

  vm.getPhoto = function() {
    Facebook.api('/' + photoId + '?access_token=' + vm.access_token, function(response) {
      vm.photo = response;
    });
  };

  vm.getUser = function() {
    Facebook.api('/me', function(response) {
      vm.user = response;
      Facebook.api('/' + vm.user.id + '/picture', function(response) {
        vm.user.picture = response.data;
      });
    });
  };

  vm.close = function () {
    $modalInstance.close();
  };

  (function init() {
    vm.getUser();
    vm.getPhoto();
  })();
}
