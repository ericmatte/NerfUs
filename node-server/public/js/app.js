'use strict';   // See note about 'use strict'; below

var app = angular.module('myApp', ['ngRoute', 'ngWebsocket'])
.run(function ($rootScope, $websocket) {
    // Game variables
    $rootScope.gameVars = {'gun': undefined, 'game': undefined};

    $rootScope.ws = $websocket.$new('ws://' + document.domain + ':5050'); // instance of ngWebsocket, handled by $websocket service

    $rootScope.ws.$on('$open', function () {
        console.log('Websocket connected.');
    });

    $rootScope.ws.$on('$close', function () {
        console.log('Noooooooooou, I want to have more fun with Websocket, but the connection is now close. Damn it!');
    });
});


app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '../static/templates/partials/index.html'
        }).when('/gun-selection', {
            templateUrl: '../static/templates/partials/gun-selection.html'
        }).when('/game-selection', {
            templateUrl: '../static/templates/partials/game-selection.html'
        }).when('/ready', {
            templateUrl: '../static/templates/partials/ready.html'
        }).when('/mbed', {
            templateUrl: '../static/templates/partials/mbed.html'
        }).when('/about', {
            templateUrl: '../static/templates/partials/about.html'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);

/* Gun Selection */
app.controller('GunSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.gun = undefined;
    $http({method: 'POST', url: '/get-guns'})
        .success(function (data, status) {
            $rootScope.gun = data[0];
        })
        .error(function (data, status) {
            alert("Error while loading the weapons!");
        });


    $rootScope.ws.$on('select_gun', function (selectedGun) {
        $rootScope.gun = selectedGun;
        $scope.$apply();
    });
}]);

/* Game Selection */
app.controller('GameSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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
                $rootScope.gameVars.game = $scope.games[i];
                window.location = '/#/ready';
                return;
            }
        }
    };
}]);

/* mbed Available Commands */
app.controller('mbed', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.commands = [
        {title: 'Select gun', description: 'Command to send when the RFID of a gun has been scanned.',
         event: 'gun', data: '34ba12987ffa'},
        {title: 'Start game', description: 'Allow the game to start.',
         event: 'start', data: ''},
        {title: 'Mission report', description: 'Target=12, Enemies=8, Allies=4, AverageReflexTimeInMs=2000, GameLengthInMs=12354, Score=12668',
         event: 'report', data: '{"Target":12, "Enemies":8, "Allies":4, "AverageReflexTimeInMs":2000, "GameLengthInMs":12354, "Score":12668}'},
        {title: 'Chat test', description: 'Simple way to test the websocket connection. Just send something with the event name "chat". The server will respond it back to you. You can also try sending a simple string with no event defined.',
         event: 'chat', data: 'Message test'}];

    $http({method: 'POST', url: '/get-guns'})
        .success(function (data, status) {
            $scope.commands[0]['commands'] = [];
            for (var i = 0; i < data.length; i++) {
                $scope.commands[0]['commands'].push(data[i].rfid_code);
            }
        });

    $scope.sendCommand = function (event, data) {
        if (data == undefined) {
            $rootScope.ws.$emit(event);
        } else {
            $rootScope.ws.$emit(event, data);
        } 
    };

    $rootScope.ws.$on('chat', function (message) {
        alert(message);
    });
}]);
