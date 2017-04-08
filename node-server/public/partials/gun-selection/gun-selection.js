'use strict';

angular.module('myApp.gunSelection', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/gun-selection', {
        templateUrl: 'static/partials/gun-selection/gun-selection.html',
        controller: 'GunSelector'
    });
}])

.controller('GunSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.guns = undefined;

    /** Get the list of guns */
    $http({ method: 'POST', url: '/get-guns' })
        .success(function (data, status) {
            $scope.guns = data;
        })
        .error(function (data, status) {
            alert("Error while loading the weapons!");
        });

    /** Change the selected index to match the chosen gun
     * @param {Dict} gun The gun to select
     */
    $scope.selectGun = function (gun) {
        $rootScope.ws.$emit('gun', gun);
    };
}]);
