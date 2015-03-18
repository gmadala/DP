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
 * 12. GET /kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/{vehicleId}/{mileage}/{zipCode}
 *
 * For VIN lookup
 * 1. User enters VIN
 * 2. User enters mileage
 * 3. User enters ZIP code
 * 4. User clicks lookup
 * 5. GET /kbb/vehicle/getvehiclevaluesbyvinallconditions/UsedCar/Dealer/{vin}/{mileage}/{zipCode}
 */

'use strict';

angular.module('nextgearWebCommon')
  .factory('Kbb', function(apiCommon, $q) {

    var api = apiCommon;
    // for the moment return a single value object
    // with values for AuctionExcellent, AuctionFair, AuctionGood, AuctionVeryGood

    /*
    Price type enum from server side code
     (talked with Chris and it seems the server will return the number, not the enum name):

     BaseWholesale = 0,
     Wholesale = 1,
     BaseRetail = 2,
     Retail = 3,
     PrivatePartyExcellent = 4,
     PrivatePartyGood = 5,
     PrivatePartyVeryGood = 6,
     PrivatePartyFair = 7,
     TradeInExcellent = 8,
     TradeInGood = 9,
     TradeInVeryGood = 10,
     TradeInFair = 11,
     MSRP = 12,
     Invoice = 13,
     AuctionExcellent = 14,
     AuctionGood = 15,
     AuctionVeryGood = 16,
     AuctionFair = 17,
     CPO = 18,
     TradeInExcellentRangeLow = 19,
     TradeInExcellentRangeHigh = 20,
     TradeInGoodRangeLow = 21,
     TradeInGoodRangeHigh = 22,
     TradeInVeryGoodRangeLow = 23,
     TradeInVeryGoodRangeHigh = 24,
     TradeInFairRangeLow = 25,
     TradeInFairRangeHigh = 26,
     NewCarFairPurchasePrice = 27,
     NewCarFairPurchasePriceRangeLow = 28,
     NewCarFairPurchasePriceRangeHigh = 29,
     CPORangeLow = 30,
     CPORangeHigh = 31,
     UsedCarFairPurchasePrice = 32,
     UsedCarFairPurchasePriceRangeLow = 33,
     UsedCarFairPurchasePriceRangeHigh = 34
     */

    var extractAuctionValues = function (result) {

      if(!result){
        return [];
      }

      var valuations = result.ValuationPrices;
      if (!valuations || valuations.length === 0) {
        return [];
      }

      var auctionValues = {};
      valuations.forEach(function (value) {

        var property = null;

        switch (value.PriceType) {
        case '14':
          property = '14';
          break;
        case '17':
          property = '17';
          break;
        case '15':
          property = '15';
          break;
        case '16':
          property = '16';
          break;
        default:
          property = null;
        }
        if (property) {
          auctionValues[property] = value.Value || 0;
        }
      });
      return auctionValues;
    };

    return {
      getYears: function() {

        return api.request('GET', '/kbb/vehicle/getyears/UsedCar/Dealer').then(function(years) {
          return years;
        });
      },
      getMakes: function(year) {
        if(!year || !year.Key) {
          throw new Error('Missing year');
        }

        return api.request('GET', '/kbb/vehicle/getmakesbyyear/UsedCar/Dealer/' + year.Key).then(function (makes) {
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

        var path = '/kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/' + make.Key + '/' + year.Key;

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

        var path = '/kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/' + model.Key + '/' + year.Key;

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
        var path = '/kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/' + style.VehicleId + '/' +
          mileage + '/' + zipCode;

        return api.request('GET', path).then(function(result) {

          var res = extractAuctionValues(result);

          if(!result || res.length === 0) {
            return $q.reject(false);
          }
          return res;
        });
      },
      getConfigurations: function(vin, zipCode) {
        if(!vin) {
          throw new Error('Missing mileage');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }
        var path = '/kbb/vin/getvehicleconfigurationbyvin/' + vin + '/' + zipCode;

        // TODO Access Denied
        return api.request('GET', path).then(function(configurations) {
          return configurations;
        });
      },
      lookupByConfiguration: function(configuration, mileage, zipCode) {
        if(!configuration) {
          throw new Error('Missing configuration');
        }
        if(!mileage) {
          throw new Error('Missing mileage');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }

        var path = '/kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/' + configuration.Id + '/' +
          mileage + '/' + zipCode;

        return api.request('GET', path).then(function(result) {

          var res = extractAuctionValues(result);

          if(!result || res.length === 0) {
            return $q.reject(false);
          }
          return res;
        });
      },
      getConfiguration: function(style, zipCode) {
        if(!style || !style.VehicleId) {
          throw new Error('Missing style');
        }
        if(!zipCode) {
          throw new Error('Missing ZIP code');
        }
        var path = '/kbb/vehicle/getvehicleconfigurationbyvehicleid/UsedCar/Dealer/' + style.VehicleId + '/' + zipCode;

        return api.request('GET', path).then(function(configurations) {
          return configurations;
        });
      }
    };
  });
