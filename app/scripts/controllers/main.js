'use strict';

/**
 * @ngdoc function
 * @name stcsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stcsApp
 */
angular.module('stcsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
