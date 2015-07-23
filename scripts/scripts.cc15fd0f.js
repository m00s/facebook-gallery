"use strict";function AuthController(a,b,c,d){function e(){f.albums=c.get()}var f=this;f.albums={},f.access_token=a.get(),f.session=b.get(),e(),f.login=function(){b.login().then(e)},f.logout=function(){b.logout().then(e)},d.$on("SESSION_STARTED",e)}function AlbumCtrl(a,b,c,d,e,f,g){function h(){d.fetchPhotos(j.albumId).then(function(a){j.photos=a.data,d.get().data&&(j.album=d.get(j.albumId),j.album||i())})}function i(){f.path("/")}var j=this;j.albumId=a.albumId,j.session=g.get(),j.photos=[],e.$on("SESSION_STARTED",h),j.open=function(a){var d=b.open({animation:!0,templateUrl:c.photoModal,controller:"ModalInstanceCtrl as vm",size:"lg",resolve:{photoId:function(){return a}}});d.result.then(function(a){j.selected=a})},g.started().then(h,i)}function PhotoModalCtrl(a,b,c,d){var e=this;e.photoId=b,e.access_token=d.get(),e.getPhoto=function(){c.api("/"+b+"?access_token="+e.access_token,function(a){e.photo=a})},e.getUser=function(){c.api("/me",function(a){e.user=a,c.api("/"+e.user.id+"/picture",function(a){e.user.picture=a.data})})},e.close=function(){a.close()},function(){e.getUser(),e.getPhoto()}()}function AccessTokenService(a){function b(b){return a.set("facebook.session",b),f=b}function c(){return f}function d(){return!!f}function e(){return a.remove("facebook.session"),f=null}var f=a.get("facebook.session");return{get:c,isDefined:d,set:b,destroy:e}}function albumThumbnailCtrl(a){var b=this;b.access_token=a.get()}function ProfileService(a,b){function c(){return e}function d(){var c=b.defer();return a.api(f,function(a){e=a,c.resolve(a)}),c.promise}var e={},f="/me";return{get:c,fetch:d}}function SessionService(a,b,c,d,e){function f(){return k}function g(){return m}function h(){var c=e.defer();return l=e.defer(),m=l.promise,a.login(function(a){b.set(a.authResponse.accessToken),j().then(function(){c.resolve()},function(a){c.reject(a)})}),c.promise}function i(){var d=e.defer();return a.logout(function(){b.destroy(),c.destroy(),j(),d.resolve()}),d.promise}function j(){var f=e.defer();return a.getLoginStatus(function(a){"connected"===a.status?(b.isDefined()||b.set(a.authResponse.accessToken),k.loggedIn=!0,d.fetch().then(function(a){c.fetch(a.id).then(function(){l.resolve(),f.resolve()},function(a){l.reject(a)})},function(a){l.reject(a)})):(k.loggedIn=!1,f.reject(),l.reject())}),f.promise}var k={loggedIn:!1},l=e.defer(),m=l.promise;return{login:h,logout:i,start:j,get:f,started:g}}function AlbumService(a,b,c){function d(b){var d=c.defer();return b?a.api("/"+b+"/albums",function(a){a&&!a.error?(i=a,d.resolve(i)):(console.error(a.error),d.reject(a.error))}):d.reject("No profile id provided"),d.promise}function e(d){var e=c.defer();return d||e.reject("id required"),a.api("/"+d+"/photos?access_token="+b.get(),function(a){e.resolve(a)}),e.promise}function f(){return i={}}function g(a){for(var b=0;b<i.data.length;b++)if(i.data[b].id===a)return i.data[b];return null}function h(a){return a?g(a):i}var i={};return{fetch:d,fetchPhotos:e,destroy:f,get:h}}angular.module("eversnapApp",["ngAnimate","ngAria","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularSpinner","eversnapApp.controllers","eversnapApp.services","eversnapApp.directives"]).constant("templates",{main:"views/main.html",album:"views/album.html",albumThumbnail:"views/albumThumbnail.html",photoModal:"views/photoModal.html",photoComments:"views/photoComments.html",photoThumbnail:"views/photoThumbnail.html"}).config(["templates","$routeProvider","localStorageServiceProvider","FacebookProvider","usSpinnerConfigProvider",function(a,b,c,d,e){b.when("/",{templateUrl:a.main,controller:"MainCtrl",controllerAs:"vm"}).when("/album/:albumId",{templateUrl:a.album,controller:"AlbumCtrl",controllerAs:"vm"}).otherwise({redirectTo:"/#/"}),c.setPrefix("eversnap").setStorageType("localStorage"),e.setDefaults({color:"blue",radius:8,length:0,lines:20,width:2,corners:1,rotate:0,trail:83,speed:2}),d.init("1470920089866672")}]).run(["Session","$rootScope",function(a,b){a.start().then(function(){b.$broadcast("SESSION_STARTED")})}]),angular.module("eversnapApp.controllers",["ui.bootstrap"]).controller("MainCtrl",AuthController),AuthController.inject=["AccessToken","Session","Album","$rootScope"],AuthController.$inject=["AccessToken","Session","Album","$rootScope"],angular.module("eversnapApp.controllers").controller("AlbumCtrl",AlbumCtrl),AlbumCtrl.$inject=["$routeParams","$modal","templates","Album","$rootScope","$location","Session"],angular.module("eversnapApp.controllers").controller("ModalInstanceCtrl",PhotoModalCtrl),PhotoModalCtrl.$inject=["$modalInstance","photoId","Facebook","AccessToken"],angular.module("eversnapApp.services",["LocalStorageModule","facebook"]).factory("AccessToken",AccessTokenService),AccessTokenService.$inject=["localStorageService"],angular.module("eversnapApp.directives",[]).directive("esAlbumThumbnail",["templates",function(a){return{restrict:"E",templateUrl:a.albumThumbnail,scope:{album:"="},controller:albumThumbnailCtrl,controllerAs:"vm",bindToController:!0}}]),albumThumbnailCtrl.$inject=["AccessToken"],angular.module("eversnapApp.directives").directive("esPhotoThumbnail",["templates",function(a){return{templateUrl:a.photoThumbnail,restrict:"E",scope:{photos:"=",onClick:"&"},controller:angular.noop,controllerAs:"vm",bindToController:!0}}]),angular.module("eversnapApp.directives").directive("esPhotoComments",["templates",function(a){return{templateUrl:a.photoComments,restrict:"E",scope:{comments:"="},controller:angular.noop,controllerAs:"vm",bindToController:!0}}]),angular.module("eversnapApp.services").factory("Profile",ProfileService),ProfileService.$inject=["Facebook","$q"],angular.module("eversnapApp.services").factory("Session",SessionService),SessionService.$inject=["Facebook","AccessToken","Album","Profile","$q"],angular.module("eversnapApp.services").factory("Album",AlbumService),AlbumService.$inject=["Facebook","AccessToken","$q"];