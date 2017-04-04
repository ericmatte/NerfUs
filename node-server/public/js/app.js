'use strict';   // See note about 'use strict'; below

var app = angular.module('myApp', ['ngRoute', 'ngWebsocket'])
    .run(function ($rootScope, $websocket) {
        $rootScope.range = function (num) {
            return new Array(num);
        }

        // Game variables
        $rootScope.game = { 'gun': undefined, 'game': undefined };

        $rootScope.websocketUrl = 'ws://' + document.domain + ':8000/';
        $rootScope.ws = $websocket.$new($rootScope.websocketUrl); // instance of ngWebsocket, handled by $websocket service

        $rootScope.ws.$on('$open', function () {
            console.log('Websocket connected.');
        });

        $rootScope.ws.$on('$close', function () {
            console.log('Noooooooooou, I want to have more fun with Websocket, but the connection is now close. Damn it!');
        });

        // Route selection on 'start' websocket
        $rootScope.ws.$on('start', function () {
            switch (window.location.hash) {
                case "#/":
                    window.location = '/#/gun-selection';
                    break;
                case "#/gun-selection":
                    window.location = '/#/game-selection';
                    break;
                case "#/game-selection":
                    window.location = '/#/ready';
                    break;
                default:
            }
        });
    });


app.config(['$routeProvider', function ($routeProvider) {
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
    }).otherwise({
        redirectTo: '/'
    });
}
]);

/* Starting screen (Index) */
app.controller('StartingScreen', ['$scope', '$rootScope', function ($scope, $rootScope) {

}]);

/* Gun Selection */
app.controller('GunSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.current = 0;
    $scope.guns = undefined;
    $rootScope.game.gun = undefined;

    $http({ method: 'POST', url: '/get-guns' })
        .success(function (data, status) {
            $scope.guns = data;
        })
        .error(function (data, status) {
            alert("Error while loading the weapons!");
        });

    $scope.selectGun = function (gun) {
        for (var i = 0; i < $scope.guns.length; i++) {
            if ($scope.guns[i].gun_id == gun.gun_id) {
                $scope.current = i;
            }
        }
    };

    $rootScope.ws.$on('select_gun', function (selectedGun) {
        $scope.selectGun(selectedGun);
        $scope.$apply();
    });

    $rootScope.ws.$on('navigate', function (position) {
        var i = $scope.current + ((position == 'next') ? 1 : -1);
        i = (i<0) ? 0 : (i>=$scope.guns.length) ? $scope.guns.length-1 : i;
        $scope.current = i;
        $scope.$apply();
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $rootScope.game.gun = $scope.guns[$scope.current]; // Save the selected gun
        $rootScope.ws.$un('select_gun'); // Detaching scope websocket
        $rootScope.ws.$un('navigate'); // Detaching scope websocket
    });
}]);

/* Game Selection */
app.controller('GameSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.current = 0;
    $scope.games = undefined;
    $rootScope.game.game = undefined;

    $http({ method: 'POST', url: '/get-games' })
        .success(function (data, status) {
            $scope.games = data;
        })
        .error(function (data, status) {
            alert("Error while loading all games!");
        });

    $scope.selectGame = function (game) {
        for (var i = 0; i < $scope.games.length; i++) {
            if ($scope.games[i].game_id == game.game_id) {
                $scope.current = i;
            }
        }
    };

    $rootScope.ws.$on('navigate', function (position) {
        var i = $scope.current + ((position == 'next') ? 1 : -1);
        i = (i<0) ? 0 : (i>=$scope.games.length) ? $scope.games.length-1 : i;
        $scope.current = i;
        $scope.$apply();
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $rootScope.game.game = $scope.games[$scope.current]; // Save the selected game
        $rootScope.ws.$un('navigate'); // Detaching scope websocket
    });
}]);

/* mbed Available Commands */
app.controller('mbed', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.commands = [
        {
            title: 'Start game', description: 'Allow the game to start. Also used to navigate between menus.',
            event: 'start'
        },
        {
            title: 'Navigate', description: 'Allow navigation between items in menu.',
            event: 'navigate', data: 'next', commands: ['previous', 'next']
        },
        {
            title: 'Select gun', description: 'Command to send when the RFID of a gun has been scanned.',
            event: 'gun', data: '34ba12987ffa'
        },
        {
            title: 'Mission report', description: 'Target=12, Enemies=8, Allies=4, AverageReflexTimeInMs=2000, GameLengthInMs=12354, Score=12668',
            event: 'report', data: '{"Target":12, "Enemies":8, "Allies":4, "AverageReflexTimeInMs":2000, "GameLengthInMs":12354, "Score":12668}'
        },
        {
            title: 'Chat test', description: 'Simple way to test the websocket connection. Just send something with the event name "chat". The server will respond it back to you. You can also try sending a simple string with no event defined.',
            event: 'chat', data: 'Message test'
        }];

    $http({ method: 'POST', url: '/get-guns' })
        .success(function (data, status) {
            var gunIndex = $scope.commands.map(function(e) { return e.event; }).indexOf('gun');

            $scope.commands[gunIndex]['commands'] = [];
            for (var i = 0; i < data.length; i++) {
                $scope.commands[gunIndex]['commands'].push(data[i].rfid_code);
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

    $scope.$on('$routeChangeStart', function (next, current) {
        $rootScope.ws.$un('chat'); // Detaching scope websocket
    });
}]);
