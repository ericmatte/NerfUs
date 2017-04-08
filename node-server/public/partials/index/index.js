'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'static/partials/index/index.html',
        controller: 'StartingScreen'
    }).otherwise({
        redirectTo: '/'
    });
}])

.controller('StartingScreen', ['$scope', '$rootScope', function ($scope, $rootScope) {

}]);
