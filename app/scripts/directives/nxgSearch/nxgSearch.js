'use strict';

angular.module('nextgearWebApp')
  .directive('nxgSearch', function () {
    return {
      templateUrl: 'scripts/directives/nxgSearch/nxgSearch.html',
      scope: {
        title: '@',
        prompt: '@',
        filterLabel: '@',
        filterOptions: '=', // array of objects with properties label, value
        activeCriteria: '=', // object with properties: query, startDate, endDate, filter
        showDateRange: '&',
        onSearch: '&',
        onClear: '&'
      },
      controller: 'NxgSearchCtrl'
    };
  })
  .controller('NxgSearchCtrl', function ($scope, $attrs) {

    $scope.dateRangeShown = true;
    if (angular.isDefined($attrs.showDateRange)) {
      $scope.$watch($scope.showDateRange, function (value) {
        $scope.dateRangeShown = value;
      });
    }

    $scope.dateRangeValid = function (startDate, endDate) {
      if (!$scope.dateRangeShown) { return true; }
      if (startDate && endDate) {
        return startDate.getTime() <= endDate.getTime();
      }
      return true;
      // validation is permissive in that startDate, endDate, or both can be missing.
      // you should substitute an appropriate default value for these if the user doesn't specify
    };

    $scope.search = function () {
      $scope.validity = angular.copy($scope.searchForm);
      $scope.validity.$error.invalidDateRange =
        $scope.activeCriteria && !this.dateRangeValid($scope.activeCriteria.startDate, $scope.activeCriteria.endDate);

      if (!$scope.searchForm.$valid || $scope.validity.$error.invalidDateRange) {
        return;
      }
      $scope.onSearch();
    };

    $scope.clear = function () {
      $scope.onClear();
    };

  });
