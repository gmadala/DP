'use strict';

angular.module('nextgearWebApp')
  .controller('PromosCtrl', PromosCtrl);
function PromosCtrl($scope, $filter, api) {

  var getEventSalesData = function() {

    api.request('GET',api.ngenContentLink('/eventsales'),null,null,true, api.ngenSuccessHandler).then(
      function (result) {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var promos = $filter('orderBy')(result, 'salesDate', true);
        $scope.promosCurrent = promos.filter(function(promo){
          if(promo.salesDate >= today && !promo.terminated && !promo.promo){
            return promo;
          }
        });
        $scope.promosPast = promos.filter(function(promo){
          if(promo.salesDate < today && !promo.terminated && !promo.promo){
            return promo;
          }
        });
      }
    );
  };

  getEventSalesData();
}
