(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('pageFooter', pageFooter);

  function pageFooter() {

    return {
      restrict: 'A',
      templateUrl: 'client/shared/directives/nxg-footer/page-footer.template.html',
      controller: 'PageFooterCtrl'
    };

  }
})();