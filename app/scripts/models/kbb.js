/**
 * Value lookup from MobileService/kbb (Kelley Blue Book) is accomplished in the following steps:
 *
 * For Manual lookup
 * 1. GET /kbb/vehicle/getyears/UsedCar/Dealer
 * 2. User selects the year
 * 3. GET /kbb/vehicle/getmakesbyyear/UsedCar/Dealer/{yearId}
 * 4. User selects the make
 * 5. GET /kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/{makeId}/{yearId}
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
 * 5. GET /kbb/vehicle/getvehiclevaluesbyvinallconditions/UsedCar/Dealer/{vin}/{mileage}/{zipCode}
 */

'use strict';

angular.module('nextgearWebApp')
  .factory('Kbb', function(api, $q) {

    // for the moment return a single value object
    // with values for AuctionExcellent, AuctionFair, AuctionGood, AuctionVeryGood

    var extractAuctionValues = function (results) {

      if(!results || results.length === 0){
        return [];
      }

      var auctionValues = {};
      results.forEach(function (value) {

        var property = null;

        switch (value.priceType) {
        case 'AuctionExcellent':
          property = 'AuctionExcellent';
          break;
        case 'AuctionFair':
          property = 'AuctionFair';
          break;
        case 'AuctionGood':
          property = 'AuctionGood';
          break;
        case 'AuctionVeryGood':
          property = 'AuctionVeryGood';
          break;
        default:
          property = null;
        }
        if (property) {
          auctionValues[property] = value.priceValue || 0;
        }
      });
      return [auctionValues]; // TODO can there be multiple?
    };

    // the vehicleClass and applicationCategory are currently not options for the client (using UsedCar/Dealer)
    var methodPathTemplate = _.template('/kbb/vehicle/${method}/UsedCar/Dealer');

    var getMethodPath = function(methodName){

      return methodPathTemplate({ method: methodName });
    };

    return {
      getYears: function() {

        return api.request('GET', getMethodPath('getyears')).then(function(years) {
          return years;
        });
      },
      getMakes: function(year) {
        if(!year || !year.Key) {
          throw new Error('Missing year');
        }

        return api.request('GET', getMethodPath('getmakesbyyear') + '/' + year.Key).then(function (makes) {
          return makes;
        });
      },
      getModels: function(make, year) {
        if(!year || !year.Key) {
          throw new Error('Missing year');
        }
        if(!make || !make.Key) {
          throw new Error('Missing make');
        }

        var path = getMethodPath('getmodelsbyyearandmake') + '/' + make.Key + '/' + year.Key;

        return api.request('GET', path).then(function(models) {
          return models;
        });
      },
      getBodyStyles: function(year, model) {
        if(!year || !year.Key) {
          throw new Error('Missing year');
        }
        if(!model || !model.Key) {
          throw new Error('Missing model');
        }

        var path = getMethodPath('gettrimsandvehicleidsbyyearandmodel') + '/' + model.Key + '/' + year.Key;

        return api.request('GET', path).then(function(styles) {
          return styles;
        });
      },
      lookupByOptions: function(style, mileage, zipCode) {
        if(!style || !style.VehicleId) {
          throw new Error('Missing style');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }
        var path = getMethodPath('getvehiclevaluesallconditions') + '/' + style.VehicleId + '/' + mileage + '/' + zipCode;

        return api.request('GET', path).then(function(vehicles) {

          var res = extractAuctionValues(vehicles);

          if(!vehicles || res.length === 0) {
            return $q.reject(false);
          }
          return res;
        });
      },
      lookupByVin: function(vin, mileage, zipCode) {
        if(!vin) {
          throw new Error('Missing vin');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }

        var path = getMethodPath('getvehiclevaluesbyvinallconditions') + '/' + vin + '/' + mileage + '/' + zipCode;

        return api.request('GET', path).then(function(results) {

          var res = extractAuctionValues(results);

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
