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
    
    $rootScope.ws.$on('countdown', function (countdown) {
        $scope.countdown = countdown;
        $scope.$apply();
    });

    /** Detachs all websockets of the scope and save the selected gun */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.ws.$un('countdown');
    });
}]);
