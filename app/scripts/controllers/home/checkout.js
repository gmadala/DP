'use strict';

angular.module('nextgearWebApp')
  .controller('CheckoutCtrl', function ($scope, $dialog) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.fees = [1];
    $scope.payments = [1, 2];
    $scope.confirm = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/confirmCheckout.html',
        controller: 'ConfirmCheckoutCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
    $scope.schedulePayment = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/scheduleCheckout.html',
        controller: 'ScheduleCheckoutCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };
  });
