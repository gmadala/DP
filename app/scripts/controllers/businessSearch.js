'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function ($scope, dialog, apiBaseUrl, $http, $log) {

    $scope.results = [];

    // Load more results.
    // This function is called from the infinite scroll directive in the view.
    $scope.loadMore = function() {
      // This should be refactored into it's own service.
      // It's silly to inject `apiBaseUrl`, and `$http` here when a single service would do.
      $http.get(apiBaseUrl.get() + '/Dealer/SearchSeller').then(
        function(result) { $scope.results = $scope.results.concat(result.data.Data.DealerInfoList); },
        function(error) { $log.error(error); }
      );
    };

    // Allow the dialog to close itself.
    // `dialog` is magically resolved/injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };
  });
