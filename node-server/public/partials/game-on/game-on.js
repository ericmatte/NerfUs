'use strict';

angular.module('myApp.gameOn', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/game-on', {
        templateUrl: 'static/partials/game-on/game-on.html',
        controller: 'GameOn'
    });
}])

.controller('GameOn', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    $scope.countdown = 3;
    $scope.time = undefined

    $rootScope.ws.$on('countdown', function (countdown) {
        $scope.countdown = countdown;
        $scope.$apply();
    });

    $rootScope.ws.$on('remainingTime', function (remainingTime) {
        if ($scope.time === undefined) {
            $scope.time = { minutes: undefined, seconds: undefined, milliseconds: undefined };
        }

        $scope.time.minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        $scope.time.seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        $scope.time.deciseconds = Math.floor((remainingTime % 1000) / 100);

        $scope.$apply();
    });

    /** Detachs all websockets of the scope and save the selected gun */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.ws.$un('countdown');
        $rootScope.ws.$un('remainingTime');
    });
}]);
