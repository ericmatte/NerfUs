'use strict';

angular.module('myApp.missionSummary', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ready', {
        templateUrl: 'static/partials/mission-summary/mission-summary.html',
        controller: 'MissionSummary'
    });
}])

.controller('MissionSummary', ['$scope', '$rootScope', function ($scope, $rootScope) {
    /** Send the starting command to the server */
    $scope.startGame = function () {

    };
}]);
