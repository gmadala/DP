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
        activeCriteria: '=', // object with properties: query, startDate, endDate, filter, invLoc
        showDateRange: '&',
        onSearch: '&',
        onClear: '&',
        filterable: '=',
        helpText: '@',
        info: '@',
        showLocationFilter: '&' // whether to display the filter for inventory location
      },
      controller: 'NxgSearchCtrl'
    };
  })
  .controller('NxgSearchCtrl', function ($scope, $attrs, User) {
    $scope.showHelpText = ($attrs.helpText) ? true : false;
    $scope.showInventoryLocation = angular.isDefined($attrs.showLocationFilter) ? $attrs.showLocationFilter : false;

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

    // if we have inventory locations to filter, set them here.
    $scope.inventoryLocations = [];
    var locs = User.getInfo().FlooredBusinessAddresses || [];

    // Add default 'view all' options
    $scope.inventoryLocations.push({ label: 'View All', value: undefined });

    // Populate inventory location options in proper format (label & value)
    angular.forEach(locs, function(value) {
      var obj = {
        label: value ? value.Line1 + (value.Line2 ? ' ' + value.Line2 : '') + ' / ' + value.City + ' ' + value.State : '',
        value: value
      };
      $scope.inventoryLocations.push(obj);
    });

    $scope.clear = function ($event) {
      $event.preventDefault();
      $scope.validity = {}; // reset form errors
      $scope.onClear();
    };

  });
