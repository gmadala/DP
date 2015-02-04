'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentDetailsCtrl', function ($scope, dialog, activity, gettextCatalog) {

    angular.forEach(activity.PaymentItems, function(value){
      value.ItemName = gettextCatalog.getString(value.ItemName);
    });

    $scope.payment = activity;

    $scope.close = function() {
      dialog.close();
    };
  });
