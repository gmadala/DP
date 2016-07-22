(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('PromosCtrl', PromosCtrl);

  PromosCtrl.$inject = ['$scope', '$filter', 'api', 'segmentio', 'kissMetricInfo', 'metric'];

  function PromosCtrl($scope, $filter, api, segmentio, kissMetricInfo, metric) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    kissMetricInfo.getKissMetricInfo().then(function(result){
      segmentio.track(metric.VIEW_PROMO_PAGE, result);
    });

    $scope.viewDetails = function (promo) {
      var expired = promo.salesDate >= today && !promo.terminated ? false : true;

      kissMetricInfo.getKissMetricInfo().then(function(result){
        result.expired = expired;
        segmentio.track(metric.CLICK_PROMO_DETAILS, result);
      });
    };

    api.request('GET',api.ngenContentLink('/eventsales'),null,null,true, api.ngenSuccessHandler).then(
      function (result) {
        var promos = $filter('orderBy')(result, 'salesDate', true);
        $scope.promosCurrent = promos.filter(function(promo){
          if(promo.salesDate >= today && !promo.terminated){
            return promo;
          }
        });
        $scope.promosPast = promos.filter(function(promo){
          if(promo.salesDate < today && !promo.terminated){
            return promo;
          }
        });
      }
    );

  }
})();
