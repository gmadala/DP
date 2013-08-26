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
        setSelected: '&onSelect'
      },
      controller: 'BusinessFieldCtrl'
    };
  })
  .controller('BusinessFieldCtrl', function($scope, $dialog) {
    $scope.query = '';

    $scope.clearSelected = function () {
      $scope.setSelected({business: null});
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
      $dialog.dialog(dialogOptions).open().then(function (selectedBusiness) {
        if (selectedBusiness) {
          // replace any existing query text with the selected business name
          $scope.query = selectedBusiness.BusinessName;
          $scope.setSelected({business: selectedBusiness});
        }
      });
    };

    // clear any existing data when field becomes disabled
    $scope.$watch('disabled', function (isDisabled) {
      if (isDisabled) {
        $scope.query = null;
        $scope.clearSelected();
      }
    });

  });
