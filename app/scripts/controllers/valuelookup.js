'use strict';

angular.module('nextgearWebApp')
  .controller('ValueLookupCtrl', function ($scope, $filter, Mmr, Blackbook, Kbb, User, gettextCatalog, gettext,
                                           metric, segmentio, kissMetricInfo) {

    // need to use the string twice because gettext doesn't like variable sadly.
    var disclaimerHeader =  gettext('© %YEAR% By Kelley Blue Book Co., Inc.');
    disclaimerHeader = gettextCatalog.getString(disclaimerHeader);

    var disclaimerEdition = gettext('%START_DATE% - %END_DATE% Edition for zip code %ZIP_CODE%.');
    disclaimerEdition = gettextCatalog.getString(disclaimerEdition);

    var disclaimerRight = gettext('All Rights Reserved.');
    disclaimerRight = gettextCatalog.getString(disclaimerRight);

    var disclaimerText = gettext('The specific information required to determine the' +
      ' value for this particular vehicle was supplied by the person generating this' +
      ' report. Vehicle valuations are opinions and may vary from vehicle to vehicle.' +
      ' Actual valuations will vary based upon market conditions, specifications,' +
      ' vehicle condition or other particular circumstances pertinent to this' +
      ' particular vehicle or the transaction or the parties to the transaction.' +
      ' This report is intended for the individual use of the person generating' +
      ' this report only and shall not be sold or transmitted to another party.' +
      ' Kelley Blue Book assumes no responsibility for errors or omissions.');
    disclaimerText = gettextCatalog.getString(disclaimerText);
    var boldDiv = '<div><strong>%CONTENT%</strong></div>';
    var normalDiv = '<div>%CONTENT%</div>';

    var disclaimer = boldDiv.replace(/%CONTENT%/, disclaimerHeader);
    disclaimer = disclaimer + boldDiv.replace(/%CONTENT%/, disclaimerEdition);
    disclaimer = disclaimer + boldDiv.replace(/%CONTENT%/, disclaimerRight);
    disclaimer = disclaimer + normalDiv.replace(/%CONTENT%/, disclaimerText);

    $scope.results = {};
    $scope.searchInProgress = false;
    $scope.isUnitedStates = User.isUnitedStates();
    $scope.kbbEnabled = (User.getFeatures.hasOwnProperty("kbb") ? User.getFeatures.kbb.enabled  : true) && $scope.isUnitedStates;

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
      } else if (lookupValue === 'kbb') {
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
      return !$scope.kbbEnabled || ($scope.manualLookup.searchComplete && !$scope.results.kbb.data && !$scope.results.kbb.noMatch);
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
      zipcode: null,
      version: null,
      validity: {},
      searchComplete: false,
      resetSearch: function() {
        this.vin = null;
        this.mileage = null;
        this.zipcode = null;
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
        $scope.results.zipcode = which.zipcode;

        var whichMetric = which.zipcode ? metric.CLICK_VALUE_LOOKUP_VIN_WITH_ZIP_LOOKUP_BUTTON :
          metric.CLICK_VALUE_LOOKUP_VIN_WITHOUT_ZIP_LOOKUP_BUTTON;

        kissMetricInfo.getKissMetricInfo().then(
          function(result){
            segmentio.track(whichMetric,result);
          }
        );

        // search blackbook
        Blackbook.lookupByVin(this.vin, this.mileage, true).then(function(results) {
          if (results.length > 0) {
            $scope.results.blackbook.data = results[0];
            if(results.length > 1) {
              $scope.results.blackbook.multiple = results;
            }
            if (!$scope.results.description && $scope.results.kbb.noMatch && results) {
              // only use blackbook as last resort.
              $scope.results.description = results[0].Year + ' ' + results[0].Make;
            }
          } else {
            $scope.results.blackbook.noMatch = true;
          }
        }, function() {
          // no results
          $scope.results.blackbook.noMatch = true;
        });

        // search mmr
        Mmr.lookupByVin(this.vin, this.mileage).then(function(results) {
          if (results.length > 0) {
            if(results.length > 1) {
              $scope.results.mmr.multiple = results;
            }
            $scope.results.mmr.data = results[0];
            // we use the MMR result as the default for vehicle description
            $scope.results.description = results[0].Year + ' ' + results[0].Make;
          } else {
            $scope.results.mmr.noMatch = true;
          }
        }, function() {
          // no results
          $scope.results.mmr.noMatch = true;
        });

        // search KBB
        if ($scope.kbbEnabled) {
          if (this.zipcode) { // only search if there is a zip code
            var vin = this.vin;
            var mileage = this.mileage;
            var zipCode = this.zipcode;

            Kbb.getVersion().then(function(version) {
              var replacements = {};
              replacements['%YEAR%'] = $filter('moment')(version.EndDate, 'YYYY');
              replacements['%START_DATE%'] = $filter('moment')(version.StartDate);
              replacements['%END_DATE%'] = $filter('moment')(version.EndDate);
              replacements['%ZIP_CODE%'] = zipCode;
              $scope.disclaimer = disclaimer.replace(/%\w+%/g, function(match) {
                return replacements[match] || match;
              });
            });

            Kbb.getConfigurations(vin, zipCode).then(function (results) {
              if (results.length > 0) {
                $scope.results.kbb.configuration = results[0];
                if (results.length > 1) {
                  $scope.results.kbb.configurations = results;
                }

                Kbb.lookupByConfiguration($scope.results.kbb.configuration, mileage, zipCode).then(function (result) {
                  $scope.results.kbb.data = result;
                }, function (error) {
                  // no valuation results
                  if (error && error.hasOwnProperty('dismiss')) {
                    error.dismiss();
                  }
                  $scope.results.kbb.noMatch = true;
                });

                if (!$scope.results.description && !$scope.results.blackbook.noMatch && results) {
                  var configuration = $scope.results.kbb.configuration;
                  $scope.results.description = configuration.Year.Value + ' ' + configuration.Make.Value;
                }
              } else {
                // no result
                $scope.results.kbb.noMatch = true;
              }
            }, function (error) {
              // server error
              error.dismiss();
              $scope.results.kbb.noMatch = true;
            });
          } else {
            // no VIN entered
            $scope.results.kbb.noMatch = true;
          }
          //search end KBB
        }

        this.searchComplete = true;
        $scope.searchInProgress = false;
      },
      validate: function() {
        this.validity = angular.copy($scope.vinLookupForm);
        return $scope.vinLookupForm.$valid;
      }
    };

    $scope.updateKbbData = function() {
      var mileage = $scope.vinLookup.mileage;
      var zipCode = $scope.vinLookup.zipcode;
      var configuration = $scope.results.kbb.configuration;
      Kbb.lookupByConfiguration(configuration, mileage, zipCode).then(function (result) {
        $scope.results.kbb.data = result;
      }, function (error) {
        // no results
        error.dismiss();
        $scope.results.kbb.noMatch = true;
      });
    };

    $scope.manualLookup = {
      showBlackbook: true,
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

          kissMetricInfo.getKissMetricInfo().then(
            function(result){
              segmentio.track(metric.CLICK_VALUE_LOOKUP_NGC_LOOKUP_BUTTON,result);
            }
          );

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
          return $scope.manualLookupForm.$valid;
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

          kissMetricInfo.getKissMetricInfo().then(
            function(result){
              segmentio.track(metric.CLICK_VALUE_LOOKUP_MMR_LOOKUP_BUTTON,result);
            }
          );

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
          return $scope.manualLookupForm.$valid;
        }
      },

      kbb: {
        version: null,
        fields: ['years', 'makes', 'models', 'styles'],
        years: {
          selected: null,
          list: [],
          fill: function() {
            resetOptions('years', 'kbb');

            if ($scope.kbbEnabled) {
              Kbb.getYears().then(function (years) {
                kb.years.list = years;
                kb.years.selected = null;
              }, function (error) {
                error.dismiss();
              });
            }
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
              }, function (error) {
                error.dismiss();
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
              }, function (error) {
                error.dismiss();
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
              Kbb.getBodyStyles(kb.years.selected, kb.models.selected).then(function(bodyStyles) {
                kb.styles.list = bodyStyles;

                if (bodyStyles.length === 1) {
                  kb.styles.selected = bodyStyles[0];
                }
              }, function (error) {
                error.dismiss();
              });
            }
          }
        },
        mileage: null,
        zipcode: null,
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
          $scope.results.zip = which.zipcode;

          kissMetricInfo.getKissMetricInfo().then(
            function(result){
              segmentio.track(metric.CLICK_VALUE_LOOKUP_KBB_LOOKUP_BUTTON,result);
            }
          );

          // since kbb does not return info about the vehicle in the return value, set it here
          var descriptionProperties = {
            Make: which.makes.selected.Value,
            Model: which.models.selected.Value,
            Year: which.years.selected.Value
          };

          Kbb.getVersion().then(function(version) {
            var replacements = {};
            replacements['%YEAR%'] = $filter('moment')(version.EndDate, 'YYYY');
            replacements['%START_DATE%'] = $filter('moment')(version.StartDate);
            replacements['%END_DATE%'] = $filter('moment')(version.EndDate);
            replacements['%ZIP_CODE%'] = which.zipcode;
            $scope.disclaimer = disclaimer.replace(/%\w+%/g, function(match) {
              return replacements[match] || match;
            });
          });

          Kbb.lookupByOptions(which.styles.selected, which.mileage, which.zipcode).then(function(vehicle) {
            // TODO find out real behavior here
            // MMR will almost always return only one result based
            // on all 5 params, and if there are multiples, the
            // values will likely be the same anyway. So, we
            // assume there is only item in the array
            $scope.results.kbb.data = vehicle;
            $scope.results.description = buildDescription(descriptionProperties);
          }, function(error) {
            // no results
            if (error && error.hasOwnProperty('dismiss')) {
              error.dismiss();
            }
            $scope.results.kbb.noMatch = true;
          });

          $scope.searchInProgress = false;
          $scope.manualLookup.searchComplete = true;
        },
        validate: function() {
          this.validity = angular.copy($scope.manualLookupForm);
          return $scope.manualLookupForm.$valid;
        }
      },
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
        kb.zipcode = null;

        resetResults();
      },
      lookup: function () {
        switch ($scope.lookupValues.id) {
        case 'bb':
          this.blackbook.lookup();
          break;
        case 'mmr':
          this.mmr.lookup();
          break;
        case 'kbb':
          this.kbb.lookup();
          break;
        default:
          $scope.manualLookupForm.lookupValues.$setValidity('required', false);
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
    $scope.manualLookup.kbb.years.fill(); // Default KBB

    $scope.manualLookupValues=[
      { id:'', name: gettextCatalog.getString('Select Manual Lookup Values')},
      { id:'bb', name: gettextCatalog.getString('NextGear Book Wholesale Values')},
      { id:'mmr', name: gettextCatalog.getString('MMR Wholesale Values')}
    ];
    $scope.lookupValues = $scope.manualLookupValues[0];

    if ($scope.kbbEnabled){
      $scope.manualLookupValues.push({ id:'kbb', name: gettextCatalog.getString('Kelley Blue Book® Auction Values')});
    }
  });
