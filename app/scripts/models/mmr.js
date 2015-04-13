'use strict';

angular.module('nextgearWebApp')
  .factory('Mmr', function(api, $q, gettextCatalog) {

    // remove any results that have null for all pertinent value properties
    // (Excellent, Good, Average, Fair)
    var removeNulls = function(results) {
      return _.filter(results, function(r) {
        return !!r.ExcellentWholesale || !!r.GoodWholesale || !!r.AverageWholesale || !!r.FairWholesale;
      });
    };

    var isValid = function(param) {
      if (!param) {
        return false;
      } else {
        return angular.isObject(param) && !angular.isArray(param);
      }
    };

    return {
      getYears: function() {
        return api.request('GET', '/mmr/years/').then(function(years) {
          return years;
        });
      },
      getMakes: function(year) {
        if(!isValid(year)) {
          throw new Error('Missing year');
        }

        return api.request('GET', '/mmr/makes/' + year.Id).then(function(makes) {
          return makes;
        });
      },
      getModels: function(make, year) {
        if(!isValid(year)) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!isValid(make)) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }

        return api.request('GET', '/mmr/models/' + make.Id + '/' + year.Id).then(function(models) {
          return models;
        });
      },
      getBodyStyles: function(make, year, model) {
        if(!isValid(year)) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!isValid(make)) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }
        if(!isValid(model)) {
          throw new Error(gettextCatalog.getString('Missing model'));
        }

        return api.request('GET', '/mmr/bodystyles/' + make.Id + '/' + year.Id + '/' + model.Id).then(function(styles) {
          return styles;
        });
      },
      lookupByOptions: function(year, make, model, style, mileage) {
        if(!isValid(year)) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!isValid(make)) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }
        if(!isValid(model)) {
          throw new Error(gettextCatalog.getString('Missing model'));
        }
        if(!isValid(style)) {
          throw new Error(gettextCatalog.getString('Missing style'));
        }
        if(!mileage || !angular.isNumber(mileage)) {
          throw new Error(gettextCatalog.getString('Missing mileage'));
        }

        var requestObj = {
          'yearId': year.Id,
          'modelId': model.Id,
          'makeId': make.Id,
          'mileage': mileage,
          'bodyId': style.Id
        };

        return api.request('GET', '/mmr/getVehicleValueByOptions', requestObj).then(function(vehicles) {
          var res = removeNulls(vehicles);

          if(!vehicles || res.length === 0) {
            return $q.reject(false);
          }
          return res;
        });
      },
      lookupByVin: function(vin, mileage) {
        if(!vin || !angular.isString(vin)) {
          throw new Error('Missing vin');
        }

        return api.request('GET', '/mmr/getVehicleValueByVin/' + vin + (mileage ? '/' + mileage : '')).then(function(results) {
          var res = removeNulls(results);

          // if there was a failure
          if(!results || res.length === 0) {
            return $q.reject(false);
          } else {
            return res;
          }
        });
      }
    };
  });
