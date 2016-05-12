(function() {
  'use strict';

  angular.module('nextgearWebApp')
    .controller('CreditQueryCtrl', CreditQueryCtrl);

  CreditQueryCtrl.$inject = [
    '$scope',
    '$uibModalInstance',
    'CreditQuery',
    'dealerSearch',
    'options',
    'kissMetricInfo',
    'segmentio',
    'User',
    'metric'
  ];

  function CreditQueryCtrl(
    $scope,
    $uibModalInstance,
    CreditQuery,
    dealerSearch,
    options,
    kissMetricInfo,
    segmentio,
    User,
    metric) {

    var uibModalInstance = $uibModalInstance;

    $scope.dirty = false;
    $scope.business = {
      id: options.businessId,
      number: options.businessNumber,
      auctionAccessNumbers: options.businessAuctionAccessNumbers,
      externalId: options.externalBusinessId,
      name: options.businessName,
      address: options.businessAddress,
      city: options.businessCity,
      state: options.businessState,
      zipCode: options.businessZip,
      creditQuery: {
        requested: false,
        retrieved: false,
        loading: false,
        error: null,
        get: function() {
          this.loading = true;
          this.requested = true;
          this.error = null;
          CreditQuery.get(options.businessId).then(
            function(data) {
              kissMetricInfo.getKissMetricInfo().then(
                function(result) {
                  segmentio.track(metric.AUCTION_INDIVIDUAL_DEALER_LOC_QUERY_PAGE, result);
                  $scope.kissMetricData = result;
                }
              );
              this.loading = false;
              this.results = data;
              this.retrieved = true;
            }.bind(this),
            function(message) {
              message.dismiss();
              this.error = message.text;
              this.loading = false;
              this.retrieved = true;
            }.bind(this)
          );
        },
        results: []
      }
    };

    $scope.active = false;

    $scope.activate = function() {
      $scope.active = true;
    };

    $scope.hideSave = false;
    $scope.saveExternalId = function() {

      var externalId = ( $scope.business.externalId ===  '' || $scope.business.externalId ===  null) ? $scope.externalId : $scope.business.externalId ;

      User.getInfo()
          .then(function (info) {
            return dealerSearch.relateExternal($scope.business.number, info.BusinessId, externalId);
          })
          .then(function (response) {
            if (response.key) {
              $scope.business.externalId = externalId;
              $scope.dirty = true;
              $scope.active = false;
            }
          });
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      uibModalInstance.close($scope.dirty);
    };

    if (options.autoQueryCredit) {
      $scope.business.creditQuery.get();
    }
  }

})();
