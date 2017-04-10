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
        $scope.redCountdown = false;
        $scope.time = undefined

        $rootScope.ws.$on('countdown', function (countdown) {
            $scope.countdown = countdown;
            $scope.$apply();
        });

        $rootScope.ws.$on('remainingTime', function (remainingTime) {
            $scope.time = $rootScope.msToTime(remainingTime);

            // If their is not much time remaining, will blink the countdown
            function timerBlinker() {
                $scope.redCountdown = !$scope.redCountdown;
                $scope.blinker = setTimeout(timerBlinker, 100 * $scope.time.seconds);
            }

            if ($scope.time.minutes == 0 && $scope.time.seconds <= 10 && $scope.blinker == undefined) {
                $scope.blinker = setTimeout(timerBlinker, 100 * $scope.time.seconds);
            }

            $scope.$apply();
        });

        /** Detachs all websockets of the scope and save the selected gun */
        $scope.$on('$locationChangeStart', function (event) {
            if ($scope.blinker != undefined) {
                clearTimeout($scope.blinker);
                $scope.blinker = undefined;
            }
            clearInterval($scope.blinker);
            $rootScope.ws.$un('countdown');
            $rootScope.ws.$un('remainingTime');
        });
    }]);
