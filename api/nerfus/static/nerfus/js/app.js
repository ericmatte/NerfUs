'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute']);

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
    socket.emit('my event', {data: 'Website connected.'});
});

// Game variables
var gameVars = {'gun': undefined, 'game': undefined};

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/static/nerfus/partials/index.html'
        }).when('/gun-selection', {
            templateUrl: '../static/nerfus/partials/gun-selection.html'
        }).when('/game-selection', {
            templateUrl: '../static/nerfus/partials/game-selection.html'
        }).when('/ready', {
            templateUrl: '../static/nerfus/partials/ready.html'
        }).when('/mbed', {
            templateUrl: '../static/nerfus/partials/mbed.html'
        }).when('/about', {
            templateUrl: '../static/nerfus/partials/about.html'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);

/* Gun Selection */
myApp.controller('GunSelector', ['$scope', '$http', function ($scope, $http) {
    $scope.gun = undefined;
    $http({method: 'POST', url: '/get-guns'})
        .success(function (data, status) {
            $scope.gun = data[0];
        })
        .error(function (data, status) {
            alert("Error while loading the weapons!");
        });

    socket.on('select_gun', function (selectedGun) {
        $scope.gun = selectedGun;
        gameVars.gun = selectedGun;
        $scope.$apply();
    });
}]);

/* Game Selection */
myApp.controller('GameSelector', ['$scope', '$http', function ($scope, $http) {
    $scope.games = undefined;
    $http({method: 'POST', url: '/get-games'})
        .success(function (data, status) {
            $scope.games = data;
        })
        .error(function (data, status) {
            alert("Error while loading all games!");
        });

    $scope.selectGame = function (gameId) {
        for (var i = 0; i < $scope.games.length; i++) {
            if ($scope.games[i].game_id == gameId) {
                gameVars.game = $scope.games[i];
                window.location = '/#/ready';
                return;
            }
        }
    };
}]);

/* mbed Available Commands */
myApp.controller('mbed', ['$scope', '$http', function ($scope, $http) {
    $scope.commands = [
        {title: "Select gun", example: "GUN=34ba12987ffa",
         description: "Command to send when the RFID of a gun has been scanned."},
        {title: "Start", example: "START",
         description: "Allow the game to start."},
        {title: "Mission report", example: "T=12,E=8,A=4,R=2000,GL=12345,S=12668",
         description: "Target=12, Enemy=8, Allie=4, AverageReflexTimeInMs=2000, GameLengthInMs=12354, Score=12668"},
        {title: "Chat test", example: "Message test", at: 'chat',
         description: "Simple way to test socket.io connection. Just send something with the event name 'chat'"}];

    $http({method: 'POST', url: '/get-guns'})
        .success(function (data, status) {
            $scope.commands[0]['commands'] = [];
            for (var i = 0; i < data.length; i++) {
                $scope.commands[0]['commands'].push("GUN=" + data[i].rfid_code);
            }
        });

    $scope.sendCommand = function (command, at) {
        at = (at != undefined) ? at: 'mbed';
        debugger
        socket.emit(at, command);
    };

    socket.on('test', function (message) {
        alert(message);
    });
}]);
