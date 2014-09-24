'use strict';

angular.module('nextgearWebApp')
  .factory('mmr', function(api, $q) {
    // function formatResults(results) {
      // var resultsArray = _.
    // }

    return {
      // getMakes: function() {
      //   return api.request('GET', '/mmr/makes/').then(function(makes) {
      //     return makes;
      //   });
      // },
      // getModels: function() {

      // },
      // getYears: function() {

      // },
      // getBodyStyles: function() {

      // },
      // lookupManual: function() {

      // },
      lookupVin: function(vin, mileage) {
        if(!vin) {
          throw new Error('Missing vin');
        }

        return api.request('GET', '/mmr/getVehicleValueByVin/' + vin + (mileage ? '/' + mileage : '')).then(function(results) {
          // if there was a failure
          if(!results || results.length === 0) {
            console.log('reject');
            return $q.reject(results);
          } else {
            return results;
          }
        }, function(error) {
          return error;
        });
      }
    };
  });
