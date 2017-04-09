'use strict';

angular.module('myApp.missionReport', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/mission-report', {
        templateUrl: 'static/partials/mission-report/mission-report.html',
        controller: 'MissionReport'
    });
}])

.controller('MissionReport', ['$scope', '$rootScope', function ($scope, $rootScope) {
}]);
