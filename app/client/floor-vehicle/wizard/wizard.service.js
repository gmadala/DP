(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('wizardService', wizardService);

  wizardService.$inject = ['$q', 'Blackbook', 'Mmr'];

  function wizardService($q, Blackbook, Mmr) {
    var cachedVin;
    var cachedOdometer;
    var cachedValuations = {
      blackbook: [],
      mmr: []
    };

    return {
      getMmrValues: getMmrValues,
      getBlackbookValues: getBlackbookValues
    };

    function getBlackbookValues(vin, odometer) {
      var deferred = $q.defer();
      if (vin === cachedVin && odometer == cachedOdometer
        && cachedValuations.blackbook.length > 0) {
        deferred.resolve(cachedValuations.blackbook);
      } else {
        Blackbook.lookupByVin(vin, odometer, true)
          .then(function(results) {
            cachedValuations.blackbook = results;
            deferred.resolve(cachedValuations.blackbook);
          })
      }
      return deferred.promise;
    }

    function getMmrValues(vin, odometer) {
      var deferred = $q.defer();
      if (vin === cachedVin && odometer == cachedOdometer
        && cachedValuations.mmr.length > 0) {
        deferred.resolve(cachedValuations.mmr);
      } else {
        Mmr.lookupByVin(vin, odometer)
          .then(function(results) {
            cachedValuations.mmr = results;
            deferred.resolve(cachedValuations.mmr);
          })
      }
      return deferred.promise;
    }
  }
})();
