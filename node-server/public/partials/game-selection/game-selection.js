'use strict';

angular.module('myApp.gameSelection', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/game-selection', {
        templateUrl: 'static/partials/game-selection/game-selection.html',
        controller: 'GameSelector'
    });
}])

.controller('GameSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.games = undefined;

    /** Get the list of games */
    $http({ method: 'POST', url: '/get-games' })
        .success(function (data, status) {
            $scope.games = data;
        })
        .error(function (data, status) {
            alert("Error while loading all games!");
        });

    /** Change the selected index to match the chosen game
     * @param {Dict} game The game to select
     */
    $scope.selectGame = function (game) {
        $rootScope.ws.$emit('game', game);
    };
}]);
