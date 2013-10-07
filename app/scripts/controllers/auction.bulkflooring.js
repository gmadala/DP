'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionBulkFlooringCtrl', function($scope, $dialog, protect, Floorplan, User) {
    // TODO: Replace this controller with regular floor a car controller

    $scope.foo = '';

    $scope.options = User.getStatics;

    $scope.openBusinessSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/businessSearch.html',
        controller: 'BusinessSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };

    $scope.submit = function () {
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);
      if (!$scope.form.$valid) {
        return false;
      }

      var confirmation = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/floorCarBulkConfirm.html',
        controller: 'FloorCarBulkConfirmCtrl',
        dialogClass: 'modal bulk-confirmation-modal',
        resolve: {
          formData: function () {
            return angular.copy($scope.data);
          }
        }
      };
      $dialog.dialog(confirmation).open().then(function (result) {
        if (result === true) {
          // submission confirmed
          $scope.reallySubmit(protect);
        }
      });
    };

    $scope.reallySubmit = function (guard) {
      if (guard !== protect) {
        throw 'FloorCarCtrl: reallySubmit can only be called from controller upon confirmation';
      }

      Floorplan.create($scope.data).then(
        function (/*success*/) {
          var title = 'Flooring Request Submitted',
            msg = 'Your flooring request has been submitted to NextGear Capital.',
            buttons = [{label: 'OK', cssClass: 'btn-primary'}];
          $dialog.messageBox(title, msg, buttons).open();
          $scope.reset();
        }, function (/*error*/) {
          return 'foo';
        }
      );
    };

  });
