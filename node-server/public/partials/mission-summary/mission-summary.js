'use strict';

angular.module('myApp.missionSummary', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ready', {
        templateUrl: 'static/partials/mission-summary/mission-summary.html',
        controller: 'MissionSummary'
    });
}])

.controller('MissionSummary', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    /** Send the starting command to the server */
    $scope.startGame = function () {
        $rootScope.nextScreen();
    };
}]);
