'use strict';

angular.module('nextgearWebApp')
  .controller('ValueLookupCtrl', function ($scope, Mmr, Blackbook) {
    $scope.results = {};
    $scope.searchInProgress = false;
    $scope.searchComplete = false;

    var buildDescription = function(obj) {
      return obj.Year + ' ' + obj.Make + ' ' + obj.Model;
    };

    var resetResults = function() {
      $scope.results = {
        blackbook: {
          multiple: null,
          noMatch: false,
          data: null
        },
        mmr: {
          multiple: null,
          noMatch: false,
          data: null
        },
        vin: null,
        mileage: null,
        description: null
      };
    };

    resetResults(); // To get everything set up

    $scope.vinLookup = {
      vin: null,
      mileage: null,
      validity: {},
      resetSearch: function() {
        this.vin = null;
        this.mileage = null;
        resetResults();
        $scope.searchComplete = false;
      },
      lookup: function() {
        var which = this;

        if (this.validate()) {
          $scope.searchInProgress = true;

          $scope.results.vin = which.vin;
          $scope.results.mileage = which.mileage;

          // search blackbook
          Blackbook.lookupByVin(this.vin, this.mileage).then(function(results) {
            if(results.length === 1) {
              $scope.results.blackbook.data = results[0];
            } else { // we have multiple results
              $scope.results.blackbook.multiple = results;
              $scope.results.blackbook.data = results[0]; // as a default
            }
            $scope.results.description = buildDescription(results[0]);
          }, function() {
            // no results
            $scope.results.blackbook.noMatch = true;
          });

          // search mmr
          Mmr.lookupByVin(this.vin, this.mileage).then(function(results) {
            if(results.length === 1) {
              $scope.results.mmr.data = results[0];
            } else { // we have multiple results
              $scope.results.mmr.multiple = results;
              $scope.results.mmr.data = results[0]; // as a default
            }

            if(!$scope.results.description && results) {
              $scope.results.description = buildDescription(results[0]);
            }
          }, function() {
            // no results
            $scope.results.mmr.noMatch = true;
          });

          $scope.searchComplete = true;
        }
        $scope.searchInProgress = false;
      },
      validate: function() {
        this.validity = angular.copy($scope.vinLookupForm);

        if (!$scope.vinLookupForm.$valid) {
          return false;
        }
        return true;
      }
    };

    $scope.manualLookup = {
      showBlackbook: true,
      blackbook: {
        makes: {
          selected: null,
          list: [],
          fill: function() {
            var bb = $scope.manualLookup.blackbook;

            Blackbook.getMakes().then(function(makes) {
              bb.makes.list = makes;
              bb.makes.selected = null;
              bb.models.list = [];
              bb.models.selected = null;
              bb.years.list = [];
              bb.years.selected = null;
              bb.styles.list = [];
              bb.styles.selected = null;
            });
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            var bb = $scope.manualLookup.blackbook;
            bb.models.list = [];
            bb.models.selected = null;
            bb.years.list = [];
            bb.years.selected = null;
            bb.styles.list = [];
            bb.styles.selected = null;

            if(bb.makes.selected) {
              Blackbook.getModels(bb.makes.selected).then(function(models) {
                bb.models.list = models;

                if(models.length === 1) {
                  bb.models.selected = models[0];
                  bb.years.fill();
                }
              });
            }
          }
        },
        years: {
          selected: null,
          list: [],
          fill: function() {
            var bb = $scope.manualLookup.blackbook;
            bb.years.list = [];
            bb.years.selected = null;
            bb.styles.list = [];
            bb.styles.selected = null;

            if(bb.models.selected) {
              Blackbook.getYears(bb.makes.selected, bb.models.selected).then(function(years) {
                bb.years.list = years;

                if(years.length === 1) {
                  bb.years.selected = years[0];
                  bb.styles.fill();
                }
              });
            }
          }
        },
        styles: {
          selected: null,
          list: [],
          fill: function() {
            var bb = $scope.manualLookup.blackbook;
            bb.styles.list = [];
            bb.styles.selected = null;

            if(bb.years.selected) {
              Blackbook.getStyles(bb.makes.selected, bb.models.selected, bb.years.selected).then(function(styles) {
                bb.styles.list = styles;

                if(styles.length === 1) {
                  bb.styles.selected = styles[0];
                }
              });
            }
          }
        },
        mileage: null,
        multiple: null,
        noMatch: false,
        validity: {},
        lookup: function() {
          var which = this;

          if(which.validate()) {
            $scope.searchInProgress = true;

            $scope.results.vin = null;
            $scope.results.mileage = which.mileage;

            Blackbook.lookupByOptions(which.makes.selected, which.models.selected, which.years.selected, which.styles.selected, which.mileage).then(function(vehicles) {

              $scope.results.blackbook = vehicles;
            });
          }

          $scope.searchInProgress = false;
          $scope.searchComplete = true;
        },
        validate: function() {
          this.validity = angular.copy($scope.manualLookupForm);

          if (!$scope.manualLookupForm.$valid) {
            return false;
          }
          return true;
        }
      },
      mmr: {
        years: {
          selected: null,
          list: [],
          fill: function() {
            var mm = $scope.manualLookup.mmr;

            Mmr.getYears().then(function(years) {
              mm.years.list = years;
              mm.years.selected = null;
              mm.makes.list = [];
              mm.makes.selected = null;
              mm.models.list = [];
              mm.models.selected = null;
              mm.styles.list = [];
              mm.styles.selected = null;
            });
          }
        },
        makes: {
          selected: null,
          list: [],
          fill: function() {
            var mm = $scope.manualLookup.mmr;
            mm.makes.list = [];
            mm.makes.selected = null;
            mm.models.list = [];
            mm.models.selected = null;
            mm.styles.list = [];
            mm.styles.selected = null;

            Mmr.getMakes(mm.years.selected).then(function(makes) {
              mm.makes.list = makes;

              if(makes.length === 1) {
                mm.makes.selected = makes[0];
                mm.models.fill();
              }
            });
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            var mm = $scope.manualLookup.mmr;
            mm.models.list = [];
            mm.models.selected = null;
            mm.styles.list = [];
            mm.styles.selected = null;

            Mmr.getModels(mm.years.selected, mm.makes.selected).then(function(models) {
              mm.models.list = models;

              if(models.length === 1) {
                mm.models.selected = models[0];
                mm.styles.fill();
              }
            });
          }
        },
        styles: {
          selected: null,
          list: [],
          fill: function() {
            var mm = $scope.manualLookup.mmr;
            mm.styles.list = [];
            mm.styles.selected = null;

            Mmr.getBodyStyles(mm.years.selected, mm.makes.selected, mm.models.selected).then(function(bodyStyles) {
              mm.styles.list = bodyStyles;

              if (bodyStyles.length === 1) {
                mm.styles.selected = bodyStyles[0];
              }
            });
          }
        },
        mileage: null,
        // multiple: null,
        // noMatch: false,
        validity: {},
        lookup: function() {
          var which = this;
          // console.log($scope.manualLookup.mmr.mileage, this.mileage, which.mileage);

          if(which.validate()) {
            $scope.searchInProgress = true;
            $scope.results.vin = null;
            $scope.results.mileage = which.mileage;

            Mmr.lookupByOptions(which.years.selected, which.makes.selected, which.models.selected, which.styles.selected, which.mileage).then(function(vehicles) {
              console.log(vehicles);
              if(vehicles.length === 1) {
                $scope.results.mmr = vehicles[0];
              } else { // we have multiple results
                $scope.manualLookup.mmr.multiple = vehicles;
                $scope.results.mmr = vehicles[0]; // as a default
              }

              $scope.results.description = buildDescription(vehicles[0]);
            });
          }

          $scope.searchInProgress = false;
          $scope.searchComplete = true;
        },
        validate: function() {
          this.validity = angular.copy($scope.manualLookupForm);

          if(!$scope.manualLookupForm.$valid) {
            return false;
          }
          return true;
        }
      },
      toggleForm: function(shouldShowBlackbook) {
        this.showBlackbook = shouldShowBlackbook;
      },
      resetSearch: function() {
        this.blackbook.makes.selected = null;
        this.blackbook.models.list = [];
        this.blackbook.models.selected = null;
        this.blackbook.years.list = [];
        this.blackbook.years.selected = null;
        this.blackbook.styles.list = [];
        this.blackbook.styles.selected = null;
        this.blackbook.mileage = null;

        this.mmr.years.list = [];
        this.mmr.years.selected = null;
        this.mmr.makes.selected = null;
        this.mmr.models.list = [];
        this.mmr.models.selected = null;
        this.mmr.styles.list = [];
        this.mmr.styles.selected = null;
        this.mmr.mileage = null;
      },
      lookup: function() {
        if (this.showBlackbook) {
          this.blackbook.lookup();
        } else {
          this.mmr.lookup();
        }
      }
    };

    $scope.manualLookup.blackbook.makes.fill(); // Default Blackbook
    $scope.manualLookup.mmr.years.fill(); // Default MMR
  });
