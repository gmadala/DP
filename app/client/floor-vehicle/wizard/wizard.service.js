(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('wizardService', wizardService);

  wizardService.$inject = ['$q', 'Blackbook', 'Mmr'];

  function wizardService($q, Blackbook, Mmr) {
    var self = this;
    self.cachedVin = undefined;
    self.cachedOdometer = undefined;
    self.cachedValuations = {
      blackbook: [],
      mmr: []
    };

    return {
      getMmrValues: getMmrValues,
      getBlackbookValues: getBlackbookValues
    };

    function getBlackbookValues(vin, odometer) {
      var deferred = $q.defer();
      if (vin === self.cachedVin && odometer == self.cachedOdometer
        && self.cachedValuations.blackbook.length > 0) {
        deferred.resolve(self.cachedValuations.blackbook);
      } else {
        Blackbook.lookupByVin(vin, odometer, true)
          .then(function(results) {
            self.cachedVin = vin;
            self.cachedOdometer = odometer;
            self.cachedValuations.blackbook = results;
            deferred.resolve(self.cachedValuations.blackbook);
          })
      }
      return deferred.promise;
    }

    function getMmrValues(vin, odometer) {
      var deferred = $q.defer();
      if (vin === self.cachedVin && odometer == self.cachedOdometer
        && self.cachedValuations.mmr.length > 0) {
        deferred.resolve(self.cachedValuations.mmr);
      } else {
        Mmr.lookupByVin(vin, odometer)
          .then(function(results) {
            self.cachedVin = vin;
            self.cachedOdometer = odometer;
            self.cachedValuations.mmr = results;
            deferred.resolve(self.cachedValuations.mmr);
          })
      }
      return deferred.promise;
    }
  }
})();
