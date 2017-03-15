'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', [
 'ngRoute'
]);

myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/', {
                 templateUrl: '/static/nerfus/partials/index.html',
             }).
             when('/gun-selection', {
                 templateUrl: '../static/nerfus/partials/gun-selection.html',
             }).
             when('/about', {
                 templateUrl: '../static/nerfus/partials/about.html',
             }).
             otherwise({
                 redirectTo: '/'
             });
    }
]);

myApp.controller('GunController', ['$scope','$http', function($scope,$http) {
    $scope.greeting = 'Hola!';

    $scope.items = [{'name':'Bazooka'},{'name':'MachineGun'}];

    $scope.getItems = function() {
     $http({method: 'POST', url: '/get-guns'})
        .success(function(data, status) {
            $scope.items = data;
         })
        .error(function(data, status) {
            alert("Error");
        })
    };
}]);

myApp.controller('GunSelector', ['$scope','$http', function($scope,$http) {
    $scope.greeting = 'Hola!';

    $scope.items = [{'name':'Bazooka'},{'name':'MachineGun'}];

    $scope.getItems = function() {
     $http({method: 'POST', url: '/get-guns'})
        .success(function(data, status) {
            $scope.items = data;
         })
        .error(function(data, status) {
            alert("Error");
        })
    };
}]);
