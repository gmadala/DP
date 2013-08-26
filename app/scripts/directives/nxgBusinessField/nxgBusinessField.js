'use strict';

/**
 * This is a hybrid input combining search field + selected business field.
 * Text entered here merely sets the initial search criteria to be used
 * in the business search modal. A business can only be selected
 * from that modal (although doing so resets the search text to the name of
 * the selected business as user feedback). Any subsequent text changes here
 * clear the selected business.
 */
angular.module('nextgearWebApp')
  .directive('nxgBusinessField', function () {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgBusinessField/nxgBusinessField.html',
      replace: true,
      scope: {
        inputId: '@id',
        mode: '@nxgBusinessField',
        disabled: '=ngDisabled',
        selection: '=selectedBusiness'
      },
      controller: 'BusinessFieldCtrl'
    };
  })
  .controller('BusinessFieldCtrl', function($scope, $element, $dialog) {
    var searchOpen = false;

    $scope.query = '';

    $scope.clearSelected = function () {
      $scope.selection = null;
    };

    // TODO: Final integration with business search modal should be covered under req #304
    $scope.openBusinessSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/businessSearch.html',
        controller: 'BusinessSearchCtrl',
        resolve: {
          initialQuery: function () {
            return $scope.query;
          },
          mode: function () {
            return $scope.mode;
          }
        }
      };
      searchOpen = true;
      $dialog.dialog(dialogOptions).open().then(function (selectedBusiness) {
        if (selectedBusiness) {
          // replace any existing query text with the selected business name
          $scope.query = selectedBusiness.BusinessName;
          $scope.selection = selectedBusiness;
        }
        searchOpen = false;
        // return focus to the element
        $element.find('input').focus();
      });
    };

    // clear any existing data when field becomes disabled
    $scope.$watch('disabled', function (isDisabled) {
      if (isDisabled) {
        $scope.query = null;
        $scope.clearSelected();
      }
    });

    // force user to resolve a query to a business selection before leaving the field
    $scope.handleExit = function() {
      if ($scope.query && !$scope.selection && !searchOpen) {
        $scope.openBusinessSearch();
      }
    };

  });
