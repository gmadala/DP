'use strict';

angular.module('nextgearWebApp')
  .controller('CreditQueryCtrl', function($scope, dialog, CreditQuery, options) {
    $scope.business = {
      id: options.businessId,
      number: options.businessNumber,
      auctionAccessNumbers: options.auctionAccessNumbers,
      name: options.businessName,
      address: options.address,
      city: options.city,
      state: options.state,
      zipCode: options.zipCode,
      creditQuery: {
        disableManualRequest: options.autoQueryCredit,
        loading: false,
        error: null,
        get: function() {
          this.loading = true;
          CreditQuery.get(options.businessId).then(
            function(data) {
              this.loading = false;
              this.error = null;
              this.results = data;
            }.bind(this),
            function(reason) {
              this.error = reason;
              this.loading = false;
            }.bind(this)
          );
        },
        results: []
      }
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };

    if (options.autoQueryCredit) {
      $scope.business.creditQuery.get();
    }
  });
