'use strict';

angular.module('nextgearWebApp')
  .factory('Blackbook', function (api, $q, $filter) {

    var formatResults = function(results ) {
      return $filter('orderBy')(results[0].Results,'toString()',false);
    };

    var formatYearResults = function(results) {
      return results[0].Results.sort().reverse();
    };

    // remove any results that have null for all pertinent value properties
    // (ExtraClean, Clean, Average, Rough)
    var removeNulls = function(results) {
      return _.filter(results, function(r) {
        return !!r.ExtraCleanValue || !!r.CleanValue || !!r.AverageValue || !!r.RoughValue;
      });
    };

    return {
      getMakes: function() {
        return api.request('GET', '/analytics/blackbook/vehicles/').then(function(makes) {
          return formatResults(makes);
        });
      },
      getModels: function(make) {
        if(!make || !angular.isString(make)) {
          throw new Error('Missing make');
        }
        var encodeMake = encodeURIComponent(make);
        return api.request('GET', '/analytics/blackbook/vehicles/make?make=' + encodeMake).then(function(models) {
          return formatResults(models);
        });
      },
      getYears: function(make, model) {
        if(!make || !angular.isString(make)) {
          throw new Error('Missing make');
        }
        if(!model || !angular.isString(model)) {
          throw new Error('Missing model');
        }
        var encodeMake = encodeURIComponent(make);
        var encodeModel = encodeURIComponent(model);
        return api.request('GET', '/analytics/blackbook/vehicles/make/model?make=' + encodeMake +'&model=' + encodeModel).then(function(years) {
          return formatYearResults(years);
        });
      },
      getStyles: function(make, model, year) {
        if(!make || !angular.isString(make)) {
          throw new Error('Missing make');
        }
        if(!model || !angular.isString(model)) {
          throw new Error('Missing model');
        }
        if(!year || !angular.isString(year)) {
          throw new Error('Missing year');
        }
        var encodeMake = encodeURIComponent(make);
        var encodeModel = encodeURIComponent(model);
        return api.request('GET', '/analytics/blackbook/vehicles/make/model/1?make=' + encodeMake + '&model=' + encodeModel + '&year=' + year).then(function(styles) {
          return formatResults(styles);
        });
      },
      lookupByOptions: function(make, model, year, style, mileage, isValueLookup) {
        if(!make || !angular.isString(make)) {
          throw new Error('Missing make');
        }
        if(!model || !angular.isString(model)) {
          throw new Error('Missing model');
        }
        if(!year || !angular.isString(year)) {
          throw new Error('Missing year');
        }
        if(!style || !angular.isString(style)) {
          throw new Error('Missing style');
        }
        if(!mileage || !angular.isNumber(mileage)) {
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
          var res = removeNulls(vehicles);

          if(!vehicles || vehicles.length === 0 || isValueLookup && res.length === 0) {
            return $q.reject(false);
          }
          return isValueLookup ? res : vehicles;
        });
      },
      /**
       * Fetch the blackbook data for the type of vehicle indicated by a VIN (and optional mileage)
       *
       * @param {String} vin The VIN number
       * @param {String} [mileage] Vehicle odometer mileage, if known (you should ensure that this is numeric)
       * @param {Boolean|Object} [isValueLookup] if we are looking for valuation info
       * @return {promise} If matches are found, promise will be resolved, otherwise it will be rejected
       *
       */
      lookupByVin: function(vin, mileage, isValueLookup) {
        if(!vin || !angular.isString(vin)) {
          throw new Error('Missing vin');
        }

        return api.request('GET', '/analytics/v1_2/blackbook/' + vin + (mileage ? '/' + mileage : '')).then(function(results) {
          var res = removeNulls(results);

          // if there was a failure
          if(!results || results.length === 0 || (isValueLookup && res.length === 0) ) {
            return $q.reject(false);
          }

          /* If isValueLookup is true, we want to return only possible matches
           * with value info (ExtraClean, Clean, etc.). Otherwise, we want all
           * matches.
           */
          return isValueLookup ? res : results;
        });
      }
    };
  });
