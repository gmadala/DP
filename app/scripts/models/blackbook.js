'use strict';

angular.module('nextgearWebApp')
  .factory('Blackbook', function (api, $q, $dialog) {

    var USER_CANCEL = 'userCancel';

    var pickMatch = function (matchList) {
      var options = {
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        dialogClass: 'modal search-modal',
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

    return {
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
          url = '/analytics/blackbook/' + vin;
        } else {
          url = '/analytics/blackbook/' + vin + '/' + mileage;
        }

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
