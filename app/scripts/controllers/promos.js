'use strict';

angular.module('nextgearWebApp')
  .controller('PromosCtrl', PromosCtrl);
function PromosCtrl($scope, $filter, api) {

  var getEventSalesData = function() {

    api.request('GET',api.ngenContentLink('/eventsales'),null,null,true, api.ngenSuccessHandler).then(
      function (result) {
        $scope.promos = $filter('orderBy')(result, 'salesDate', true);
      }
    );
  };

  getEventSalesData();
}
