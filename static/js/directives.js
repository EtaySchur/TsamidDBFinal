'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('subView' , function(){
    return {
        restrict: 'E',
        templateUrl: 'create_games.html',
        controller: function($scope) {
            alert('fuad');
        }
    };
});