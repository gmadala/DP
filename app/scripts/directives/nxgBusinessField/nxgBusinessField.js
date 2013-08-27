'use strict';

/**
 * This is a hybrid input combining search field + selected business field.
 * Text entered here sets the initial search criteria to be used in the
 * business search modal. A business can only be selected from that modal
 * (doing so resets the search text to the name of the selected business as
 * user feedback). Any subsequent text changes in the field clear the selected
 * business.
 *
 * This supports the following attributes:
 * @param nxg-business-field="seller|buyer" - required, type of business to select
 * @param selected-business="expr" - selected business will be bound to this scope location
 * @param name="any" - if present, publish an ngModelController to the parent form controller under this name
 *  this controller's values will reflect the search field only, but validity will follow ng-required as below
 * @param ng-disabled="expr" - will disable both the input and the search button
 * @param ng-required="expr" - condition under which to validate that a business is selected ($error key is nxgRequires)
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
        selection: '=selectedBusiness',
        isRequired: '&ngRequired'
      },
      controller: 'BusinessFieldCtrl',
      compile: function (element, attrs) {
        // apply original name onto the new input so it will publish ngModelController to its parent form controller
        element.find('input').attr('name', attrs.name);
        // remove some duplicate & unneeded attributes on the root element
        element.removeAttr('id name ng-disabled');
      }
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
