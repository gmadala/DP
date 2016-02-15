'use strict';

angular.module('nextgearWebApp')
  .controller('PromosCtrl', PromosCtrl);
function PromosCtrl($scope, api) {

  var getEventSalesData = function() {

    api.request('GET',api.ngenContentLink('/eventsales'),null,null,true, api.ngenSuccessHandler).then(
      function (result) {
        $scope.promos = result;
      }
    );
  };

  $scope.convertSalesDate = function(ms) {
    if (ms) {
      return moment(ms).format('MM/DD/YYYY');
    }
  };

  getEventSalesData();
}
