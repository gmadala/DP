(function() {
  'use strict';

angular
  .module('nextgearWebApp')
  .directive('nxgVinDetails', nxgVinDetails);

  nxgVinDetails.$inject = [];

  function nxgVinDetails() {

    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgVinDetails/nxgVinDetails.html',
      scope: {
        data: '=floorModel',
        validity: '=',
        form: '=',
        errorFlag: '='
      },
      controller: 'VinDetailsCtrl'
    };

  }
})();
