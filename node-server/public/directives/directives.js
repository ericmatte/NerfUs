'use strict';

angular.module('myApp')

.directive("gunSpecs", ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { gun: '=' },
        link: function(scope, element, attrs) {
            scope.range = $rootScope.range;
        },
        templateUrl: 'static/directives/gun-specs.html'
    };
}])

.directive("gameDetails", function () {
    return {
        restrict: 'E',
        scope: { game: '=' },
        templateUrl: 'static/directives/game-details.html'
    };
});