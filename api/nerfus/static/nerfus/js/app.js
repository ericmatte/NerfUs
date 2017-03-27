'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute']);

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    socket.emit('my event', {data: 'Website connected.'});
});

myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/', {
                 templateUrl: '/static/nerfus/partials/index.html'
             }).
             when('/gun-selection', {
                 templateUrl: '../static/nerfus/partials/gun-selection.html'
             }).
             when('/mbed', {
                 templateUrl: '../static/nerfus/partials/mbed.html'
             }).
             when('/about', {
                 templateUrl: '../static/nerfus/partials/about.html'
             }).
             otherwise({
                 redirectTo: '/'
             });
    }
]);

myApp.controller('Example', ['$scope','$http', function($scope,$http) {
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

/* gun-selection.html */
myApp.controller('GunSelector', ['$scope','$http', function($scope,$http) {
    $scope.greeting = 'Hola!';

    $scope.items = [];
    $scope.gun = undefined;
    $http({method: 'POST', url: '/get-guns'})
        .success(function(data, status) {
            $scope.items = data;
            $scope.gun = $scope.items[1];
         })
        .error(function(data, status) {
            alert("Error while loading the weapons!");
        });

    $scope.getItems = function() {
    };
}]);

myApp.controller('mbed', ['$scope','$http', function($scope,$http) {
    $scope.greeting = 'Hola!';

    $scope.commands = [{title:"Select gun", command:"GUN=34ba12987ffa",
                        description:"Command to send when the RFID of a gun has been scanned."},
                       {title:"Start", command:"START",
                        description:"Allow the game to start."}];

    $scope.sendCommand = function(command) {
        alert(command);
    };
}]);
