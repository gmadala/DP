(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('PaymentDetailsCtrl', PaymentDetailsCtrl);

  PaymentDetailsCtrl.$inject = ['$scope', 'dialog', 'activity', 'gettext', 'gettextCatalog'];

  function PaymentDetailsCtrl($scope, dialog, activity, gettext, gettextCatalog) {

    // TODO should be translated server side but doing it this way for now https://tardis.discoverdsc.com/browse/VO-3581
    // Then we would not need this section
    // use getText to mark these for translation
    gettext('Interest');
    gettext('Principal');
    gettext('Fee - Floorplan/Curtailment');
    gettext('Fee - Record Services');
    angular.forEach(activity.PaymentItems, function (value) {
      // more proper is usually translating with a filter in the view but we want to be able to easily remove
      // this entire TODO block later.
      value.ItemName = gettextCatalog.getString(value.ItemName);
    });
    // end TODO

    $scope.payment = activity;

    $scope.close = function() {
      dialog.close();
    };

  }

})();
