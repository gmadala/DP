(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('BusinessFieldCtrl', BusinessFieldCtrl);

  BusinessFieldCtrl.$inject = ['$scope', '$element', '$uibModal', '$timeout'];

  function BusinessFieldCtrl($scope, $element, $uibModal, $timeout) {

    var uibModal = $uibModal;
    var searchOpen = false;
    $scope.query = '';
    var lengthAtSubmit = 0;

    $scope.clearSelected = function() {
      $scope.selection = null;
    };

    $scope.isValidLength = function() {
      return lengthAtSubmit >= 3;
    };

    $scope.openBusinessSearch = function() {
      lengthAtSubmit = $element.find('input').val().length;

      $scope.validity = angular.extend($scope.validity || {}, {
        inputBiz: { $error: {}}
      });

      if (!$scope.isValidLength()) {
        $scope.validity = angular.extend($scope.validity || {}, {
          inputBiz: angular.copy($scope.form.inputBiz)
        });
        return;
      }

      if (!searchOpen) {
        var dialogOptions = {
          dialogClass: 'modal modal-x-large',
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl: 'client/dealer-search/business-search-modal/business-search.template.html',
          controller: 'BusinessSearchCtrl',
          resolve: {
            initialQuery: function() {
              return $scope.query;
            },
            searchBuyersMode: function() {
              return $scope.mode === 'buyers';
            },
            closeNow: function() {
              return function() {
                return $scope.disabled;
              };
            }
          }
        };
        searchOpen = true;

        // Delay by 200ms (almost unnoticeable) so the user's click event has time to complete
        // before the popup opens, potentially cancelling the popup.
        $timeout(angular.noop, 200).then(function() {
          return uibModal.open(dialogOptions).result;
        }).then(function(selectedBusiness) {
          if (selectedBusiness) {
            // replace any existing query text with the selected business name
            $scope.query = selectedBusiness.BusinessName;
            $scope.selection = selectedBusiness;
          }
          searchOpen = false;
        });
      }
    };

    // clear any existing data when field becomes disabled
    $scope.$watch('disabled', function(isDisabled) {
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

    $scope.$on('reset', function() {
      $scope.query = '';
    });

  }
})();
