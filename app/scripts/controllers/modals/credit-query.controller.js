'use strict';

angular.module('nextgearWebApp')
  .controller('CreditQueryCtrl', function($scope, $uibModalInstance, CreditQuery, dealerSearch,
                                          options, kissMetricInfo, segmentio, User, metric) {
    var uibModalInstance = $uibModalInstance;
    $scope.business = {
      id: options.businessId,
      number: options.businessNumber,
      auctionAccessNumbers: options.auctionAccessNumbers,
      externalId: options.externalId,
      name: options.businessName,
      address: options.address,
      city: options.city,
      state: options.state,
      zipCode: options.zipCode,
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
                function(result){
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

    $scope.saveExternalId = function() {
      User.getInfo()
        .then(function(info) {
          return dealerSearch.relateExternal($scope.business.number, info.BusinessId, $scope.externalId);
        })
        .then(function(response) {
          if (response.key) {
            $scope.business.externalId = $scope.externalId;
          }
        });
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      uibModalInstance.close();
    };

    if (options.autoQueryCredit) {
      $scope.business.creditQuery.get();
    }
  });
