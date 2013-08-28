'use strict';

angular.module('nextgearWebApp')
  .directive('nxgSearch', function () {
    return {
      templateUrl: 'scripts/directives/nxgSearch/nxgSearch.html',


      //dumps placeholder values into any directive call with attribute value of "placeholder".
      scope: {
        searchType: '@nxgSearch'
      },
      controller: function($scope) {
        var filterOptions = {
          filterSelected: { selected: 'null'},
          placeholder: {
            title: 'Placeholder',
            keywordPlaceholder: 'Placeholder',
            filterLabel: 'Placeholder',
            filterOptions: [
              {label: 'None', value: 'null'},
              {label: 'Placeholder', value: 'placeholder'},
            ]
          },
        };
        //force objects to be updated and available.
        $scope.$watch('filterType', function() {
          $scope.title = filterOptions[$scope.searchType].title;
          $scope.keywordPlaceholder = filterOptions[$scope.searchType].keywordPlaceholder;
          $scope.filterSelected = filterOptions.filterSelected;
          $scope.filterLabel = filterOptions[$scope.searchType].filterLabel;
          $scope.filterOptions = filterOptions[$scope.searchType].filterOptions;
        });
      }
    };
  });
