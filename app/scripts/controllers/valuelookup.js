'use strict';

angular.module('nextgearWebApp')
  .controller('ValueLookupCtrl', function ($scope, Mmr, Blackbook, User) {
    $scope.results = {};
    $scope.searchInProgress = false;

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
        kbb: {
          multiple: null,
          noMatch: false,
          data: null
        },
        vin: null,
        mileage: null,
        description: null
      };

      $scope.manualLookup.searchComplete = false;
      $scope.vinLookup.searchComplete = false;
    };

    var resetOptions = function(field, lookupValue) {
      // clear out all the following options when a field is updated.
      var object={};
      if (lookupValue === 'mmr') {
        object = $scope.manualLookup.mmr;
      }else if(lookupValue === 'bb') {
        object = $scope.manualLookup.blackbook;
      } else {
        object = $scope.manualLookup.kbb;
      }
      var fields = object.fields;
      var index = fields.indexOf(field);

      for(var i = fields.length-1; i >= index; --i) {
        object[fields[i]].selected = null;
        object[fields[i]].list = [];
      }
    };

    $scope.hideMmrAll = function() {
      return ($scope.manualLookup.searchComplete && !$scope.results.mmr.data && !$scope.results.mmr.noMatch);
    };

    $scope.hideBlackbookAll = function() {
      return ($scope.manualLookup.searchComplete && !$scope.results.blackbook.data && !$scope.results.blackbook.noMatch);
    };

    $scope.hideKbbAll = function() {
      return ($scope.manualLookup.searchComplete && !$scope.results.kbb.data && !$scope.results.kbb.noMatch);
    };

    $scope.showMultiplesWarning = function() {
      return !!$scope.results.blackbook.multiple || !!$scope.results.mmr.multiple || !!$scope.results.kbb.multiple;
    };

    $scope.showDescription = function() {
      return !($scope.results.blackbook.noMatch && $scope.results.mmr.noMatch && $scope.results.kbb.noMatch) && ($scope.vinLookup.searchComplete || $scope.manualLookup.searchComplete);
    };

    $scope.searchCompleteCheck = function() {
      return $scope.vinLookup.searchComplete || $scope.manualLookup.searchComplete;
    };

    $scope.vinLookup = {
      vin: null,
      mileage: null,
      validity: {},
      searchComplete: false,
      resetSearch: function() {
        this.vin = null;
        this.mileage = null;
        resetResults();
      },
      lookup: function() {
        // make sure we reset the other search, in case we had already run that one.
        $scope.manualLookup.resetSearch();

        var which = this;

        if (!this.validate()) {
          return false;
        }

        $scope.searchInProgress = true;

        $scope.results.vin = which.vin;
        $scope.results.mileage = which.mileage;

        // search blackbook
        Blackbook.lookupByVin(this.vin, this.mileage, true).then(function(results) {
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

        //search Kbb Start
        /*Kbb.lookupByVin(this.vin, this.mileage).then(function(results) {
          if(results.length === 1) {
            $scope.results.kbb.data = results[0];
          } else { // we have multiple results
            $scope.results.kbb.multiple = results;
            $scope.results.kbb.data = results[0]; // as a default
          }

          if(!$scope.results.description && results) {
            $scope.results.description = buildDescription(results[0]);
          }
        }, function() {
          // no results
          $scope.results.kbb.noMatch = true;
        });*/
        // Kbb search End

        this.searchComplete = true;
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


    $scope.ChangeLayout=function(idValue){
      if(idValue === 1){
        $scope.BookValue = true;
        $scope.MMRValue = false;
        $scope.KBBValue = false;
      }else if(idValue === 2) {
        $scope.BookValue = false;
        $scope.MMRValue = true;
        $scope.KBBValue = false;
      }else{
        $scope.BookValue = false;
        $scope.MMRValue = false;
        $scope.KBBValue = true;
      }
    };



    $scope.manualLookup = {
      searchComplete: false,
      blackbook: {
        fields: ['makes', 'models', 'years', 'styles'],
        makes: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('makes','bb');

            Blackbook.getMakes().then(function(makes) {
              bb.makes.list = makes;
              bb.makes.selected = null;
            });
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('models','bb');

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
            resetOptions('years','bb');
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
            resetOptions('styles','bb');

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
        validity: {},
        lookup: function() {
          // make sure we reset the other search, in case we've already run it.
          $scope.vinLookup.resetSearch();

          var which = this;

          if(!which.validate()) {
            return false;
          }

          $scope.searchInProgress = true;
          $scope.results.vin = null;
          $scope.results.mileage = which.mileage;

          Blackbook.lookupByOptions(which.makes.selected, which.models.selected, which.years.selected, which.styles.selected, which.mileage, true).then(function(vehicles) {
            // Blackbook will only ever return one result based
            // on all 5 params; it'll always be the only item in the result array
            $scope.results.blackbook.data = vehicles[0];
            $scope.results.description = buildDescription(vehicles[0]);
          }, function() {
            // no results
            $scope.results.blackbook.noMatch = true;
          });

          $scope.searchInProgress = false;
          $scope.manualLookup.searchComplete = true;
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
        fields: ['years', 'makes', 'models', 'styles'],
        years: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('years', 'mmr');

            Mmr.getYears().then(function(years) {
              mm.years.list = years;
              mm.years.selected = null;
            });
          }
        },
        makes: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('makes', 'mmr');

            if(mm.years.selected) {
              Mmr.getMakes(mm.years.selected).then(function(makes) {
                mm.makes.list = makes;

                if(makes.length === 1) {
                  mm.makes.selected = makes[0];
                  mm.models.fill();
                }
              });
            }
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('models', 'mmr');
            if(mm.makes.selected) {
              Mmr.getModels(mm.makes.selected, mm.years.selected).then(function(models) {
                mm.models.list = models;

                if(models.length === 1) {
                  mm.models.selected = models[0];
                  mm.styles.fill();
                }
              });
            }
          }
        },
        styles: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('styles', 'mmr');

            if(mm.models.selected) {
              Mmr.getBodyStyles(mm.makes.selected, mm.years.selected, mm.models.selected).then(function(bodyStyles) {
                mm.styles.list = bodyStyles;

                if (bodyStyles.length === 1) {
                  mm.styles.selected = bodyStyles[0];
                }
              });
            }
          }
        },
        mileage: null,
        validity: {},
        lookup: function() {
          // make sure we reset the other search, in case we've already run it.
          $scope.vinLookup.resetSearch();

          var which = this;
          if(!which.validate()) {
            return false;
          }

          $scope.searchInProgress = true;
          $scope.results.vin = null;
          $scope.results.mileage = which.mileage;

          Mmr.lookupByOptions(which.years.selected, which.makes.selected, which.models.selected, which.styles.selected, which.mileage).then(function(vehicles) {
            // MMR will almost always return only one result based
            // on all 5 params, and if there are multiples, the
            // values will likely be the same anyway. So, we
            // assume there is only item in the array
            $scope.results.mmr.data = vehicles[0];
            $scope.results.description = buildDescription(vehicles[0]);
          }, function() {
            // no results
            $scope.results.mmr.noMatch = true;
          });

          $scope.searchInProgress = false;
          $scope.manualLookup.searchComplete = true;
        },
        validate: function() {
          this.validity = angular.copy($scope.manualLookupForm);

          if(!$scope.manualLookupForm.$valid) {
            return false;
          }
          return true;
        }
      },

      //KBB Start

      kbb: {
        fields: ['years', 'makes', 'models', 'styles'],
        years: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('years', 'kbb');

            Kbb.getYears().then(function(years) {
              kb.years.list = years;
              kb.years.selected = null;
            });
          }
        },
        makes: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('makes', 'kbb');

            if(kb.years.selected) {
              Kbb.getMakes(kb.years.selected).then(function(makes) {
                kb.makes.list = makes;

                if(makes.length === 1) {
                  kb.makes.selected = makes[0];
                  kb.models.fill();
                }
              });
            }
          }
        },
        models: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('models', 'kbb');
            if(kb.makes.selected) {
              Kbb.getModels(kb.makes.selected, kb.years.selected).then(function(models) {
                kb.models.list = models;

                if(models.length === 1) {
                  kb.models.selected = models[0];
                  kb.styles.fill();
                }
              });
            }
          }
        },
        styles: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('styles', 'kbb');

            if(kb.models.selected) {
              Kbb.getBodyStyles(kb.makes.selected, kb.years.selected, kb.models.selected).then(function(bodyStyles) {
                kb.styles.list = bodyStyles;

                if (bodyStyles.length === 1) {
                  kb.styles.selected = bodyStyles[0];
                }
              });
            }
          }
        },
        mileage: null,
        validity: {},
        lookup: function() {
          // make sure we reset the other search, in case we've already run it.
          $scope.vinLookup.resetSearch();

          var which = this;
          if(!which.validate()) {
            return false;
          }

          $scope.searchInProgress = true;
          $scope.results.vin = null;
          $scope.results.mileage = which.mileage;

          Kbb.lookupByOptions(which.years.selected, which.makes.selected, which.models.selected, which.styles.selected, which.mileage).then(function(vehicles) {
            // MMR will almost always return only one result based
            // on all 5 params, and if there are multiples, the
            // values will likely be the same anyway. So, we
            // assume there is only item in the array
            $scope.results.kbb.data = vehicles[0];
            $scope.results.description = buildDescription(vehicles[0]);
          }, function() {
            // no results
            $scope.results.kbb.noMatch = true;
          });

          $scope.searchInProgress = false;
          $scope.manualLookup.searchComplete = true;
        },
        validate: function() {
          this.validity = angular.copy($scope.manualLookupForm);

          if(!$scope.manualLookupForm.$valid) {
            return false;
          }
          return true;
        }
      },

      //KBB End




      /* toggleForm: function(shouldShowBlackbook) {
       this.showBlackbook = shouldShowBlackbook;
       },*/
      resetSearch: function() {
        bb.makes.selected = null;
        bb.models.list = [];
        bb.models.selected = null;
        bb.years.list = [];
        bb.years.selected = null;
        bb.styles.list = [];
        bb.styles.selected = null;
        bb.mileage = null;

        mm.years.selected = null;
        mm.makes.list = [];
        mm.makes.selected = null;
        mm.models.list = [];
        mm.models.selected = null;
        mm.styles.list = [];
        mm.styles.selected = null;
        mm.mileage = null;

        kb.years.selected = null;
        kb.makes.list = [];
        kb.makes.selected = null;
        kb.models.list = [];
        kb.models.selected = null;
        kb.styles.list = [];
        kb.styles.selected = null;
        kb.mileage = null;

        resetResults();
      },
      lookup: function() {
        if (this.showBlackbook) {
          this.blackbook.lookup();
        } else {
          this.mmr.lookup();
        }
      }
    };

    // Utility objects for easier reference
    var bb = $scope.manualLookup.blackbook;
    var mm = $scope.manualLookup.mmr;
    var kb = $scope.manualLookup.kbb;

    resetResults(); // To get everything set up
    $scope.manualLookup.blackbook.makes.fill(); // Default Blackbook
    $scope.manualLookup.mmr.years.fill(); // Default MMR
    //$scope.manualLookup.kbb.years.fill(); // Default KBB
    $scope.isUnitedStates = User.isUnitedStates();

    $scope.manualLookupValues=[
      { id:1, name:'Nextgear Book'},
      { id:2, name:'MMR Values'},
      { id:3, name:'KBB Values'}
    ];

  });
