'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, Receipts) {
    Receipts.search().then(
      function(results) { $scope.receipts = results.Receipts; },
      function(error) { $log.error(error); }
    );
  });
