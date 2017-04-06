'use strict';   // See note about 'use strict'; below

/** Make a websocket connection with the server */
function connectWebsocket($rootScope, $websocket) {
    $rootScope.websocketUrl = 'ws://' + document.domain + ':8000/';
    $rootScope.ws = $websocket.$new($rootScope.websocketUrl); // instance of ngWebsocket, handled by $websocket service
    $rootScope.ws.$on('$open', function () {
        console.log('Websocket connected.');
        // Fetch game state from server after websocket connection
        $rootScope.ws.$emit('fetch_game');
    });
    $rootScope.ws.$on('$close', function () {
        console.log('Websocket disconnected.');
    });
}

/** Initialize angular functions */
function initAngular($rootScope) {
    /** Simple function that convert a number into an array
     * This is use to make loop in angular.js templates
     * @param {Number} num The query to send to the server
     * @return {Array} An array with the length of num
     */
    $rootScope.range = function (num) {
        return new Array(num);
    }
}

var app = angular.module('myApp', ['ngRoute', 'ngWebsocket'])
    .run(function ($rootScope, $websocket, $http, $location) {
        initAngular($rootScope);
        connectWebsocket($rootScope, $websocket);

        /** Game variables */
        $rootScope.game = { inGame: true, coordinator: false };

        /** Route selection and game logics managed by the server */
        $rootScope.ws.$on('game_changed', function (gameParams) {
            if ($rootScope.game.inGame) {
                $rootScope.game = { inGame: true, coordinator: false };
                // Merge new params into the game variable
                $rootScope.game = Object.assign($rootScope.game, gameParams);
                if (gameParams.path) { $location.url(gameParams.path); }

                $rootScope.$apply();
            }
        });
        
        $rootScope.nextScreen = function () {
            $rootScope.ws.$emit('start');
        };
    });

/** Binds all routes for the app */
app.config(['$routeProvider', function ($routeProvider) {
    var prefix = '../static/templates/partials/';
    $routeProvider.when('/', {
        templateUrl: prefix + 'index.html'
    }).when('/gun-selection', {
        templateUrl: prefix + 'gun-selection.html'
    }).when('/game-selection', {
        templateUrl: prefix + 'game-selection.html'
    }).when('/ready', {
        templateUrl: prefix + 'ready.html'
    }).when('/mbed', {
        templateUrl: prefix + 'mbed.html'
    }).otherwise({
        redirectTo: '/'
    });
}]);

/* Starting screen (Index) */
app.controller('StartingScreen', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
}]);

/* Gun Selection */
app.controller('GunSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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

    /** Detachs all websockets of the scope and save the selected gun */
    $scope.$on('$locationChangeStart', function (event) {
    });
}]);

/* Game Selection */
app.controller('GameSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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

/* Mission Summary (Ready?) */
app.controller('MissionSummary', ['$scope', '$rootScope', function ($scope, $rootScope) {
    /** Send the starting command to the server */
    $scope.startGame = function () {

    };
}]);

/* mbed Available Commands */
app.controller('mbed', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.game.inGame = false;

    // List of all available mbed commands
    $scope.commands = [
        {
            title: 'mbed Coordinator discovery', description: 'On it\'s first connection, the mbed coordinator must send this command in order for the game to run.',
            event: 'mbed', data: '{"state": "connected"}', commands: ['{"state": "connected"}', '{"state": "disconnected"}']
        },
        {
            title: 'Start game', description: 'Allow the game to start. Also used to navigate between menus.',
            event: 'start'
        },
        {
            title: 'Navigate', description: 'Allow navigation between items in menu.',
            event: 'navigate', data: '{"direction": "next"}', commands: ['{"direction": "previous"}', '{"direction": "next"}']
        },
        {
            title: 'Select gun', description: 'Command to send when the RFID of a gun has been scanned.',
            event: 'gun', data: '{"rfid_code": "34ba12987ffa"}'
        },
        {
            title: 'Mission report', description: 'Target=12, Enemies=8, Allies=4, AverageReflexTimeInMs=2000, GameLengthInMs=12354, Score=12668',
            event: 'report', data: '{"Target":12, "Enemies":8, "Allies":4, "AverageReflexTimeInMs":2000, "GameLengthInMs":12354, "Score":12668}'
        },
        {
            title: 'Chat test', description: 'Simple way to test the websocket connection. Just send something with the event name "chat". The server will respond it back to you. You can also try sending a simple string with no event defined.',
            event: 'chat', data: '"Message test"'
        }];


    /** Get the list of guns */
    $http({ method: 'POST', url: '/get-guns' })
        .success(function (data, status) {
            var gunIndex = $scope.commands.map(function (e) { return e.event; }).indexOf('gun');

            $scope.commands[gunIndex]['commands'] = [];
            for (var i = 0; i < data.length; i++) {
                $scope.commands[gunIndex]['commands'].push('{"rfid_code": "' + data[i].rfid_code + '"}');
            }
        });


    /** Send the selected sample command to the server by websocket
     * @param {String} event The event of the message
     * @param {JSON} data The associated data
     */
    $scope.sendCommand = function (event, data) {
        try { data = JSON.parse(data); }
        catch (err) { }

        if (data === undefined) {
            $rootScope.ws.$emit(event);
        } else {
            $rootScope.ws.$emit(event, data);
        }
    };

    /** Show chat messages return on screen */
    $rootScope.ws.$on('chat', function (message) {
        alert(message);
    });


    /** Detachs all websockets of the scope */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.game.inGame = true;
        $rootScope.ws.$un('chat'); // Detaching scope websocket
    });
}]);
