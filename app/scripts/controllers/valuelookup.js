'use strict';

angular.module('nextgearWebApp')
  .controller('ValueLookupCtrl', function ($scope) {

    $scope.vinLookup = {
      vin: null,
      mileage: null,
      multipleResults: [],
      searchInProgress: false,
      validity: {},
      resetSearch: function() {
        $scope.vinLookup.vin = null;
        $scope.vinLookup.mileage = null;
      },
      lookup: function() {

        if (this.validate()) {
          this.searchInProgress = true;
          // search blackbook

          // search mmr

        } else {
          // nothing; inline error labels should display.
        }
      },
      validate: function() {
        this.validity = angular.copy($scope.vinLookupForm);

        if (!$scope.vinLookupForm.$valid) {
          return false;
        }

        return true;
      }
    };


  });
