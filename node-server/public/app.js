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

angular.module('myApp', [
    'ngRoute',
    'ngWebsocket',
    'myApp.index',
    'myApp.gunSelection',
    'myApp.gameSelection',
    'myApp.missionSummary',
    'myApp.gameOn',
    'myApp.missionReport',
    'myApp.mbed',
])


/** Filter for leading zeros: 21 -> 0021 */
.filter('numberFixedLen', () => (a, b) => (1e4 + "" + a).slice(-b))

.run(function ($rootScope, $websocket, $http, $location) {
    connectWebsocket($rootScope, $websocket);

    $rootScope.formatNumber = function(i) {
        return Math.round(i * 100)/100; 
    }

    /** Simple function that convert a number into an array
     * This is use to make loop in angular.js templates
     * @param {Number} num The query to send to the server
     * @return {Array} An array with the length of num
     */
    $rootScope.range = function (num) {
        return new Array(num);
    }

    /** Convert an value in ms into a time format
     * @param {Number} num The value in ms
     * @return {Array} A json of the time
     */
    $rootScope.msToTime = function (num) {
        return {
            minutes: Math.floor((num % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((num % (1000 * 60)) / 1000),
            deciseconds: Math.floor((num % 1000) / 100),
        }
    };

    $rootScope.resetGame = function () {
        $rootScope.ws.$emit('reset_game');
    }

    /** Game variables */
    $rootScope.game = { inGame: true, coordinator: false };

    /** Route selection and game logics managed by the server */
    $rootScope.ws.$on('game_changed', function (gameParams) {
        if ($rootScope.game.inGame) {
            $rootScope.game = { inGame: true, coordinator: false };
            // Merge new params into the game variable
            $rootScope.game = Object.assign($rootScope.game, gameParams);
            $rootScope.playerName = gameParams.playerName;
            
            if ($rootScope.game && $rootScope.game.report && $rootScope.game.report.gameLength) {
                $rootScope.game.report.time = $rootScope.msToTime($rootScope.game.report.gameLength);
            }

            if (gameParams.path) { $location.url(gameParams.path); }

            $rootScope.$apply();
        }
    });

    $rootScope.nextScreen = function () {
        $rootScope.ws.$emit('start');
    };
});


