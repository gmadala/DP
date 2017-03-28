(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('wizardService', wizardService);

  wizardService.$inject = ['$q', 'Blackbook', 'Mmr', 'messages'];

  function wizardService($q, Blackbook, Mmr, messages) {
    var self = this;
    self.cachedBlackbook = {
      cachedVin: undefined,
      cachedOdometer: undefined,
      blackbookValuations: []
    };

    self.cachedMmr = {
      cachedVin: undefined,
      cachedOdometer: undefined,
      mmrValuations: []
    };

    return {
      getMmrValues: getMmrValues,
      getBlackbookValues: getBlackbookValues
    };

    function getBlackbookValues(vin, odometer) {
      var deferred = $q.defer();
      var cachedBlackbook = self.cachedBlackbook;
      if (vin === cachedBlackbook.cachedVin && odometer == cachedBlackbook.cachedOdometer
        && cachedBlackbook.blackbookValuations.length > 0) {
        deferred.resolve(cachedBlackbook.blackbookValuations);
      } else {
        Blackbook.lookupByVin(vin, odometer, true)
          .then(function(results) {
            cachedBlackbook.cachedVin = vin;
            cachedBlackbook.cachedOdometer = odometer;
            cachedBlackbook.blackbookValuations = results;
            deferred.resolve(cachedBlackbook.blackbookValuations);
          })
          .catch(function() {
            preventWarningDialog();
            deferred.resolve([]);
          })
      }
      return deferred.promise;
    }

    function getMmrValues(vin, odometer) {
      var deferred = $q.defer();
      var cachedMmr = self.cachedMmr;
      if (vin === cachedMmr.cachedVin && odometer == cachedMmr.cachedOdometer
        && cachedMmr.mmrValuations.length > 0) {
        deferred.resolve(cachedMmr.mmrValuations);
      } else {
        Mmr.lookupByVin(vin, odometer)
          .then(function(results) {
            cachedMmr.cachedVin = vin;
            cachedMmr.cachedOdometer = odometer;
            cachedMmr.mmrValuations = results;
            deferred.resolve(cachedMmr.mmrValuations);
          })
          .catch(function() {
            preventWarningDialog();
            deferred.resolve([]);
          })
      }
      return deferred.promise;
    }

    // Prevent the warning dialog
    function preventWarningDialog() {
      var list = messages.list();
      list.forEach(function(element) {
        element.dismiss();
      })
    }
  }
})();
