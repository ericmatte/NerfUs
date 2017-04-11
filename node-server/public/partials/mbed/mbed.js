'use strict';

angular.module('myApp.mbed', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/mbed', {
        templateUrl: 'static/partials/mbed/mbed.html',
        controller: 'mbed'
    });
}])

.controller('mbed', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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
            event: 'report', data: '{"targets":12, "enemies":8, "allies":4, "averageReflexTime":2000, "gameLength":12354, "score":12668}'
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

    /** Handle mbed message */
    $rootScope.ws.$on('start_game', function (message) {
        alert('Message to mbed from server: "start_game"');
    });
    $rootScope.ws.$on('request_report', function (message) {
        alert('Message to mbed from server: "request_report"');
    });


    /** Detachs all websockets of the scope */
    $scope.$on('$locationChangeStart', function (event) {
        $rootScope.game.inGame = true;
        $rootScope.ws.$un('chat'); // Detaching scope websocket
        $rootScope.ws.$un('start_game'); // Detaching scope websocket
        $rootScope.ws.$un('request_report'); // Detaching scope websocket
    });
}]);
