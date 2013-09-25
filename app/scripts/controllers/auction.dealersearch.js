'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog, User) {

    $scope.query = {};
    $scope.invalid = {};

    $scope.validate = function() {
      var valid = true;
      this.invalid = {};

      if (!this.query.dealerName) {
        this.invalid.dealerName = true;
        valid  = false;
      }
      if (!this.query.city && !this.query.state) {
        this.invalid.CityOrState = true;
        valid = false;
      }
      return valid;
    };

    $scope.openNumSearch = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/NumSearchCtrl.html',
        controller: 'NumSearchCtrl'
      };
      $dialog.dialog(dialogOptions).open();
    };



    $scope.openNameSearch = function() {
      if (this.validate()) {
        var dealerName = this.query.dealerName,
          city = this.query.city,
          state = this.query.state;

        var dialogOptions = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl: 'views/modals/dealerNameSearch.html',
          controller: 'DealerNameSearchCtrl',
          resolve: {
            options: function() {
              return {
                dealerName: dealerName,
                city: city,
                state: state
              };
            }
          }
        };
        $dialog.dialog(dialogOptions).open();
      }

    };

    // Get list of states
    $scope.states = User.getStatics().states;
  });
