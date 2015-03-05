/**
 * Value lookup from MobileService/kbb (Kelley Blue Book) is accomplished in the following steps:
 *
 * For Manual lookup
 * 1. GET /kbb/vehicle/getyears/UsedCar/Dealer
 * 2. User selects the year
 * 3. GET /kbb/vehicle/getmakesbyyear/UsedCar/Dealer/{yearId}
 * 4. User selects the make
 * 5. GET /kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer
 * 6. User selects the model
 * 7. GET /kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/{modelId}/{yearId}
 * 8. User selects the style
 * 9. User enters the mileage
 * 10. User enters the ZIP code
 * 11. User clicks lookup
 * 12. GET /kbb/vehicle/getvehiclevaluesallconditions/UsedCar/Dealer/{vehicleId}/{mileage}/{zipCode}
 *
 * For VIN lookup
 * 1. User enters VIN
 * 2. User enters mileage
 * 3. User enters ZIP code
 * 4. User clicks lookup
 * 5. GET /kbb/vehicle/TODO/{vin}/{mileage}/{zipCode}
 */

'use strict';

angular.module('nextgearWebApp')
  .factory('Kbb', function(api, $q) {

    // the vehicleClass and applicationCategory are currently not options for the client
    var base = '/kbb/vehicle/';
    var vehicleClass = 'UsedCar'; // or NewCar
    var applicationCategory = 'Dealer'; // or Consumer

    // remove any results that have null for all pertinent value properties
    // (Excellent, Good, Average, Fair)
    var removeNulls = function(results) {
      return _.filter(results, function(r) {
        return !!r.ExcellentWholesale || !!r.GoodWholesale || !!r.AverageWholesale || !!r.FairWholesale;
      });
    };

    var getDefaultRequestData = function(){

      return {
        vehicleClass: vehicleClass,
        applicationCategory: applicationCategory
      };
    };

    return {
      getYears: function() {

        var data = getDefaultRequestData();

        return api.request('GET', base + 'getyears', data).then(function(years) {
          return years;
        });
      },
      getMakes: function(year) {
        if(!year) {
          throw new Error('Missing year');
        }

        var data = getDefaultRequestData();
        data.yearId = year.Id;

        return api.request('GET', base + 'getmakesbyyear', data).then(function (makes) {
          return makes;
        });
      },
      getModels: function(make, year) {
        if(!year) {
          throw new Error('Missing year');
        }
        if(!make) {
          throw new Error('Missing make');
        }

        var data = getDefaultRequestData();
        data.makeId = make.Id;
        data.yearId = year.Id;

        return api.request('GET', base + 'getmodelsbyyearandmake', data).then(function(models) {
          return models;
        });
      },
      getBodyStyles: function(model, year) {
        if(!year) {
          throw new Error('Missing year');
        }
        if(!model) {
          throw new Error('Missing model');
        }

        var data = getDefaultRequestData();
        data.modelId = model.Id;
        data.yearId = year.Id;

        return api.request('GET', base + 'gettrimsandvehicleidsbyyearandmodel', data).then(function(styles) {
          return styles;
        });
      },
      lookupByOptions: function(vehicleId, mileage, zipCode) {
        if(!vehicleId) {
          throw new Error('Missing vehicle ID');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }

        var data = getDefaultRequestData();
        data.vehicleId = vehicleId;
        data.mileage = mileage;
        data.zipCode = zipCode;

        return api.request('GET', base + 'getvehiclevaluesallconditions', data).then(function(vehicles) {
          // TODO do we need this method? Does it apply to KBB
          var res = removeNulls(vehicles);

          if(!vehicles || res.length === 0) {
            return $q.reject(false);
          }
          return res;
        });
      },
      lookupByVin: function(vin, mileage) {
        if(!vin) {
          throw new Error('Missing vin');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }

        var data = {
          vin: vin,
          mileage: mileage
        };

        return api.request('GET', base + 'TODO', data).then(function(results) {

          // TODO necessary?
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
