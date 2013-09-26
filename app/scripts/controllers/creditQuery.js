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
        requested: false,
        retrieved: false,
        loading: false,
        error: null,
        get: function() {
          this.loading = true;
          this.requested = true;
          CreditQuery.get(options.businessId).then(
            function(data) {
              this.loading = false;
              this.error = null;
              this.results = data;
              this.retrieved = true;
            }.bind(this),
            function(reason) {
              this.error = reason;
              this.loading = false;
              this.retrieved = true;
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
