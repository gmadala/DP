'use strict';

angular.module('nextgearWebApp')
  .factory('Blackbook', function (api, $q, $dialog) {

    var USER_CANCEL = 'userCancel';

    var pickMatch = function (matchList) {
      var options = {
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        dialogClass: 'modal modal-medium',
        templateUrl: 'views/modals/multipleVehicles.html',
        controller: 'MultipleVehiclesCtrl',
        resolve: {
          matchList: function () {
            return matchList;
          }
        }
      };
      return $dialog.dialog(options).open().then(function (choice) {
        if (!choice) {
          return $q.reject(USER_CANCEL);
        } else {
          return choice;
        }
      });
    };

    var formatResults = function(results) {
      return results[0].Results;
    };

    // remove any results that have null for all pertinent value properties
    // (ExtraClean, Clean, Average, Rough)
    var removeNulls = function(results) {
      return _.filter(results, function(r) {
        return !!r.ExtraCleanValue && !!r.CleanValue && !!r.AverageValue && !!r.RoughValue;
      });
    };

    return {
      getMakes: function() {
        return api.request('GET', '/analytics/blackbook/vehicles/').then(function(makes) {
          return formatResults(makes);
        });
      },
      getModels: function(make) {
        if(!make) {
          throw new Error('Missing make');
        }
        return api.request('GET', '/analytics/blackbook/vehicles/' + make).then(function(models) {
          return formatResults(models);
        });
      },
      getYears: function(make, model) {
        if(!make) {
          throw new Error('Missing make');
        }
        if(!model) {
          throw new Error('Missing model');
        }

        return api.request('GET', '/analytics/blackbook/vehicles/' + make + '/' + model).then(function(years) {
          return formatResults(years);
        });
      },
      getStyles: function(make, model, year) {
        if(!make) {
          throw new Error('Missing make');
        }
        if(!model) {
          throw new Error('Missing model');
        }
        if(!year) {
          throw new Error('Missing year');
        }

        return api.request('GET', '/analytics/blackbook/vehicles/' + make + '/' + model + '/' + year).then(function(styles) {
          return formatResults(styles);
        });
      },
      lookupByOptions: function(make, model, year, style, mileage) {
        if(!make) {
          throw new Error('Missing make');
        }
        if(!model) {
          throw new Error('Missing model');
        }
        if(!year) {
          throw new Error('Missing year');
        }
        if(!style) {
          throw new Error('Missing style');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }

        var requestObj = {
          'Make': make,
          'Model': model,
          'Year': year,
          'Miles': mileage,
          'Style': style
        };

        return api.request('POST', '/analytics/v1_2/blackbook/vehicles', requestObj).then(function(vehicles) {
          if(!vehicles || vehicles.length === 0) {
            return $q.reject(false);
          }
          return removeNulls(vehicles);
        });
      },
      lookupByVin: function(vin, mileage) {
        if(!vin) {
          throw new Error('Missing vin');
        }

        return api.request('GET', '/analytics/v1_2/blackbook/' + vin + (mileage ? '/' + mileage : '')).then(function(results) {
          // if there was a failure
          if(!results || results.length === 0) {
            return $q.reject(false);
          }

          return removeNulls(results);
        });
      },
      /**
       * Fetch the blackbook data for the type of vehicle indicated by a VIN
       *
       * @param {String} vin The VIN number
       * @param {String} [mileage] Vehicle odometer mileage, if known (you should ensure that this is numeric)
       * @param {Boolean|Object} [multiplesResolution] How to handle multiple matches
       * @return {promise} If matches are found, promise will be resolved, otherwise it will be rejected
       *
       * multiplesResolution can be any of the following:
       *  true (default) - if there are multiple matches, prompt the user to pick one; resolves with a single object
       *  false - resolves with an array of all matches, length 1-n (no user interaction)
       *  Object - a previous resolution value to use as a hint; if it can't be matched, behavior will be as w/ true
       */
      fetchVehicleTypeInfoForVin: function (vin, mileage, multiplesResolution) {
        var url;

        if (!vin) {
          throw 'Blackbook.fetchVehicleTypeInfoForVin - vin is required';
        }
        if (!angular.isDefined(multiplesResolution)) {
          multiplesResolution = true;
        }

        if (!mileage) {
          url = '/analytics/v1_2/blackbook/' + vin;
        } else {
          url = '/analytics/v1_2/blackbook/' + vin + '/' + mileage;
        }

        // TODO: This should be refactored; we don't use the multipleResolutions
        // flag anywhere; remove it, and move the selection of a single match
        // to the appropriate controllers; it does not belong in the model.
        return api.request('GET', url).then(
          function (result) {
            // no results = failure
            if (!result) {
              return $q.reject(result);
            }
            result = angular.isArray(result) ? result : [result];
            if (result.length === 0) {
              return $q.reject(result);
            } else if (result.length === 1) {
              // one match, just return it
              return result[0];
            } else if (!multiplesResolution) {
              // no multiples resolution, return all matches
              return result;
            } else if (multiplesResolution === true) {
              // invoke manual resolution
              return pickMatch(result);
            } else {
              // attempt hint-based resolution
              var match = null;
              result.some(function (candidate) {
                if (multiplesResolution.Make === candidate.Make &&
                  multiplesResolution.Model === candidate.Model &&
                  multiplesResolution.Year === candidate.Year &&
                  multiplesResolution.Style === candidate.Style) {
                  match = candidate;
                  return true;
                } else {
                  return false;
                }
              });
              return match || pickMatch(result);
            }
          }
        );
      },
      /**
       * Convenience method for checking whether lookups that may involve user
       * interaction were rejected because the user cancelled.
       *
       * @param reason Rejection reason given in promise
       * @returns {boolean} true if rejection was a user cancellation
       */
      wasUserCancelled: function(reason) {
        return reason === USER_CANCEL;
      }
    };
  });
