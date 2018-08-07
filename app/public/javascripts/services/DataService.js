'use strict';

var reviewApp = angular.module('app');

reviewApp.service('GetShipment', ['$http', function ($http) {
  this.get = function () {
    return $http.get('http://localhost:3001/api/shipping');
  }
}]);