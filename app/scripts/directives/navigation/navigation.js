'use strict';

angular.module('nextgearWebApp')
  .directive('navigation', function() {
      return {
          restrict: 'A',
          templateUrl: "scripts/directives/navigation/navigation.html",
          controller: 'NavigationCtrl'
      };
  })

  .controller('NavigationCtrl', function($scope) {
      $scope.tabs = [
          {
              title: 'Home',
              templateUrl: '../../views/home.html'
          },
          {
              title: 'Reports',
              templateUrl: 'views/reports.html'
          },
          {
              title: 'Documents',
              templateUrl: 'views/documents.html'
          }
      ];
      $scope.tabs.activeTab = 0;
  });
