'use strict';

angular.module('nextgearWebApp')
    .directive('navBar', function() {
        return {
            restrict: 'A',
            templateUrl: "scripts/directives/navBar/navBar.html",
            controller: 'NavBarCtrl'
    };
})

.controller('NavBarCtrl', function($scope) {
    $scope.isDealer = true;
    $scope.showSettings = false;
});
