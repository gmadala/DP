(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgActivity', nxgActivity);

  nxgActivity.$inject = [];

  function nxgActivity() {

    return {
      templateUrl: 'scripts/directives/nxg-activity/nxg-activity.html',
      replace: true,
      restrict: 'A',
      scope: true,
      controller: function ($scope, $http, $timeout, status) {
        var showing,
          pendingShow;

        $scope.showIndicator = function () {
          var canShow = status.isShown() && $http.pendingRequests.length > 0;

          if (!showing && !pendingShow && canShow) {
            pendingShow = $timeout(function () {
              showing = true;
              pendingShow = null;
            }, 500);
          } else if (!canShow) {
            showing = false;
            if (pendingShow) {
              $timeout.cancel(pendingShow);
              pendingShow = null;
            }
          }

          return showing;
        };
      }

    };

  }
})();
