'use strict';

angular.module('myApp.missionReport', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/mission-report', {
        templateUrl: 'static/partials/mission-report/mission-report.html',
        controller: 'MissionReport'
    });
}])

.controller('MissionReport', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.playerScoreSaved = false;

    /** Get the leaderboard */
    function getLeaderBoard () {
        $http({ method: 'POST', url: '/get-leaderboard' })
            .success(function (data, status) {
                $scope.leaderboard = data;
            })
            .error(function (data, status) {
                alert("Error while loading the leaderboard!");
            });
    }
    getLeaderBoard();

    /** Save player score and return updated leaderboard */
    $scope.savePlayerScore = function (game) {
        if ($scope.playerName) {
            var data = Object.assign($rootScope.game, { playerName: $scope.playerName });

            $http({ method: 'POST', url: '/save-player-score', data: data })
                .success(function (data, status) {
                    $scope.playerScoreSaved = true;
                    getLeaderBoard();
                })
                .error(function (data, status) {
                    alert("Error while saving player name to leaderboard!");
                });
        }
    };
}]);
