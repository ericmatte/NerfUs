'use strict';   // See note about 'use strict'; below

/** Make a websocket connection with the server */
function connectWebsocket($rootScope, $websocket) {
    $rootScope.websocketUrl = 'ws://' + document.domain + ':8000/';
    $rootScope.ws = $websocket.$new($rootScope.websocketUrl); // instance of ngWebsocket, handled by $websocket service
    $rootScope.ws.$on('$open', function () {
        console.log('Websocket connected.');
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

    /** Allow index incrementation/decrementation for a list
     * @param {Number} direction 'next' (+1) or 'previous' (-1)
     * @param {Number} index The current index in the list
     * @param {Number} arrayLength The list length
     * @return {Array} The new index
     */
    $rootScope.navigate = function (direction, index, arrayLength) {
        index += ((direction == 'next') ? 1 : -1);
        index = (index < 0) ? 0 : (index >= arrayLength) ? arrayLength - 1 : index;
        return index;
    }
}

var app = angular.module('myApp', ['ngRoute', 'ngWebsocket'])
    .run(function ($rootScope, $websocket, $http) {
        initAngular($rootScope);
        connectWebsocket($rootScope, $websocket);

        /** Game variables
         * @param {Boolean} inGame When true, the app will follow the games variables
         * @param {Dict} gun The selected gun
         * @param {Dict} game The selected game
         * @param {Boolean} coordinator true if a coordinator is connected
         */
        $rootScope.game = { inGame: false, gun: undefined, game: undefined, coordinator: undefined };
        // The list of path that the game must follow
        $rootScope.gameFlow = ['/', '/gun-selection', '/game-selection', '/ready'];

        /** Verify that the coordinator is connected before starting the game */
        $http({ method: 'POST', url: '/check-for-coordinator' })
            .success(function (coordinator, status) {
                $rootScope.game.coordinator = coordinator || undefined;
            });


        /** Route selection on 'start' websocket event */
        $rootScope.ws.$on('start', function () {
            var path = window.location.hash.substr(1);
            if (path != '/mbed') {
                if ($rootScope.game.coordinator) {
                    var index = $rootScope.gameFlow.indexOf(path);
                    window.location = '/#' + $rootScope.gameFlow[index + 1];
                }
            }
        });

        /** mbed socket handling */
        $rootScope.ws.$on('mbed', function (data) {
            var path = window.location.hash.substr(1);
            if (data.state) {
                if (data.state == 'connected') {
                    $rootScope.game.coordinator = true;
                } else {
                    $rootScope.game.coordinator = undefined;
                    if (path != 'mbed') { window.location = '/#' + $rootScope.gameFlow[0]; }
                }
            }
            $rootScope.$apply();
        });
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
    $scope.current = 0;
    $scope.guns = undefined;
    $rootScope.game.gun = undefined;

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
        for (var i = 0; i < $scope.guns.length; i++) {
            if ($scope.guns[i].gun_id == gun.gun_id) {
                $scope.current = i;
            }
        }
    };

    /** Websocket gun selection */
    $rootScope.ws.$on('select_gun', function (selectedGun) {
        $scope.selectGun(selectedGun);
        $scope.$apply();
    });

    /** Gun menu navigation */
    $rootScope.ws.$on('navigate', function (position) {
        $scope.current = $rootScope.navigate(position.direction, $scope.current, $scope.guns.length);
        $scope.$apply();
    });

    /** Detachs all websockets of the scope and save the selected gun */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.game.gun = $scope.guns[$scope.current];
        $rootScope.ws.$un('select_gun');
        $rootScope.ws.$un('navigate');
    });
}]);

/* Game Selection */
app.controller('GameSelector', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.current = 0;
    $scope.games = undefined;
    $rootScope.game.game = undefined;

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
        for (var i = 0; i < $scope.games.length; i++) {
            if ($scope.games[i].game_id == game.game_id) {
                $scope.current = i;
            }
        }
    };

    /** Game menu navigation */
    $rootScope.ws.$on('navigate', function (position) {
        $scope.current = $rootScope.navigate(position.direction, $scope.current, $scope.games.length);
        $scope.$apply();
    });

    /** Detachs all websockets of the scope and save the selected game */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.game.game = $scope.games[$scope.current]; // Save the selected game
        $rootScope.ws.$un('navigate'); // Detaching scope websocket
    });
}]);

/* Mission Summary (Ready?) */
app.controller('MissionSummary', ['$scope', '$rootScope', function ($scope, $rootScope) {
    /** Send the starting command to the server */
    $scope.startGame = function () {

    };
}]);

/* mbed Available Commands */
app.controller('mbed', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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
            event: 'gun', data: '{"id": "34ba12987ffa"}'
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
                $scope.commands[gunIndex]['commands'].push('{"id": "' + data[i].rfid_code + '"}');
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
        $rootScope.ws.$un('chat'); // Detaching scope websocket
    });
}]);
