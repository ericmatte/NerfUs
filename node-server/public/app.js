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
    'myApp.mbed',
])

.run(function ($rootScope, $websocket, $http, $location) {
    connectWebsocket($rootScope, $websocket);

    /** Simple function that convert a number into an array
     * This is use to make loop in angular.js templates
     * @param {Number} num The query to send to the server
     * @return {Array} An array with the length of num
     */
    $rootScope.range = function (num) {
        return new Array(num);
    }

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


