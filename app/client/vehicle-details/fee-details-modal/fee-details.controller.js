(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('FeeDetailsCtrl', FeeDetailsCtrl);

  FeeDetailsCtrl.$inject = ['$scope', '$uibModalInstance', 'activity', 'gettext', 'gettextCatalog'];

  function FeeDetailsCtrl($scope, $uibModalInstance, activity, gettext, gettextCatalog) {

    var uibModalInstance = $uibModalInstance;

    // TODO should be translated server side but doing it this way for now https://tardis.discoverdsc.com/browse/VO-3581
    // Then we would not need this section
    // use getText to mark these for translation
    gettext('Records Services Charge');
    // more proper is usually translating with a filter in the view but we want to be able to easily remove
    // this entire TODO block later.
    activity.FeeName = gettextCatalog.getString(activity.FeeName);
    // end TODO

    $scope.fee = activity;

    $scope.close = function () {
      uibModalInstance.close();
    };

  }
})();
