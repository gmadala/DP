'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:        '@nxgPaymentButtons',
        item:        '=',
        queueStatus: '=',
        isScheduled: '=',
        canPayNow:   '='
      },
      controller: function($scope, $dialog, Payments) {

        $scope.$watch('isScheduled + type', function () {
          if ($scope.isScheduled && $scope.type === 'payment') {
            $scope.type = 'scheduled-payment';
          } else if (!$scope.isScheduled && $scope.type === 'scheduled-payment') {
            $scope.type = 'payment';
          }
        });

        $scope.toggleInQueue = function (asPayoff) {
          if (!$scope.queueStatus) {
            Payments.addToPaymentQueue($scope.item, asPayoff);
          } else {
            Payments.removeFromPaymentQueue($scope.item);
          }
        };

        $scope.cancelScheduled = function () {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/cancelPayment.html',
            controller: 'CancelPaymentCtrl',
            resolve: {
              payment: function () {
                return $scope.item;
              }
            }
          };

          $dialog.dialog(dialogOptions).open();
        };

      },
      templateUrl: 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html',
      replace: true
    };
  });
