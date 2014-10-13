'use strict';

angular.module('nextgearWebApp')
  .factory('Mmr', function(api, $q, gettextCatalog) {

    // remove any results that have null for all pertinent value properties
    // (Excellent, Good, Average, Fair)
    var removeNulls = function(results) {
      return _.filter(results, function(r) {
        return !!r.ExcellentWholesale && !!r.GoodWholesale && !!r.AverageWholesale && !!r.FairWholesale;
      });
    };

    return {
      getYears: function() {
        return api.request('GET', '/mmr/years/').then(function(years) {
          return years;
        });
      },
      getMakes: function(year) {
        if(!year) {
          throw new Error('Missing year');
        }

        return api.request('GET', '/mmr/makes/' + year.Id).then(function(makes) {
          return makes;
        });
      },
      getModels: function(make, year) {
        if(!year) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!make) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }

        return api.request('GET', '/mmr/models/' + make.Id + '/' + year.Id).then(function(models) {
          return models;
        });
      },
      getBodyStyles: function(make, year, model) {
        if(!year) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!make) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }
        if(!model) {
          throw new Error(gettextCatalog.getString('Missing model'));
        }

        return api.request('GET', '/mmr/bodystyles/' + make.Id + '/' + year.Id + '/' + model.Id).then(function(styles) {
          return styles;
        });
      },
      lookupByOptions: function(year, make, model, style, mileage) {
        if(!year) {
          throw new Error(gettextCatalog.getString('Missing year'));
        }
        if(!make) {
          throw new Error(gettextCatalog.getString('Missing make'));
        }
        if(!model) {
          throw new Error(gettextCatalog.getString('Missing model'));
        }
        if(!style) {
          throw new Error(gettextCatalog.getString('Missing style'));
        }
        if(!mileage) {
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

        return api.request('GET', '/mmr/getVehicleValueByVin/' + vin + (mileage ? '/' + mileage : '')).then(function(results) {
          // if there was a failure
          if(!results || results.length === 0) {
            return $q.reject(false);
          } else {
            return removeNulls(results);
          }
        });
      }
    };
  });
