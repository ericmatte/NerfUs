'use strict';

angular.module('myApp.gameOn', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/game-on', {
        templateUrl: 'static/partials/game-on/game-on.html',
        controller: 'GameOn'
    });
}])

.controller('GameOn', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function () {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
}]);
