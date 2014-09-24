'use strict';

angular.module('nextgearWebApp')
  .controller('ValueLookupCtrl', function ($scope, mmr, Blackbook) {
    $scope.results = {
      blackbook: null,
      mmr: null,
      vin: null,
      mileage: null,
      description: null
    };

    var buildDescription = function(obj) {
      return obj.Year + ' ' + obj.Make + ' ' + obj.Model;
    };

    $scope.vinLookup = {
      vin: null,
      mileage: null,
      multipleBlackbook: null,
      multipleMmr: null,
      noBlackbookMatch: false,
      noMmrMatch: false,
      searchInProgress: false,
      searchComplete: false,
      validity: {},
      resetSearch: function() {
        this.vin = null;
        this.mileage = null;
        this.description = null;
        this.multipleBlackbook = null;
        this.multipleMmr = null;
        this.noBlackbookMatch = false;
        this.noMmrMatch = false;
        $scope.results = {
          blackbook: null,
          mmr: null,
          vin: null,
          mileage: null
        };
        this.searchComplete = false;
      },
      lookup: function() {
        var which = this;

        if (this.validate()) {
          this.searchInProgress = true;

          $scope.results.vin = which.vin;
          $scope.results.mileage = which.mileage;

          // search blackbook
          Blackbook.lookupVin(this.vin, this.mileage).then(function(results) {
            if(results.length === 1) {
              $scope.results.blackbook = results[0];
            } else { // we have multiple results
              $scope.vinLookup.multipleBlackbook = results;
              $scope.results.blackbook = results[0]; // as a default
            }

            $scope.results.description = buildDescription(results[0]);
            console.log($scope.results.description);
          }, function() {
            // no results
            which.noBlackbookMatch = true;
            console.log($scope.vinLookup);
          });

          // search mmr
          mmr.lookupVin(this.vin, this.mileage).then(function(results) {
            if(results.length === 1) {
              $scope.results.mmr = results[0];
            } else { // we have multiple results
              $scope.vinLookup.multipleMmr = results;
              $scope.results.mmr = results[0]; // as a default
            }
            if(!$scope.results.description) {
              $scope.results.description = buildDescription(results[0]);
              console.log($scope.results.description);
            }
          }, function() {
            // no results
            which.noMmrMatch = true;
            console.log($scope.vinLookup);
          });

          this.searchComplete = true;
          $scope.searchInProgress = false;
        } else {
          $scope.searchInProgress = false;

        }
        console.log('end', $scope.vinLookup);
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
