(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('footer', footer);

  function footer() {

    return {
      restrict: 'A',
      templateUrl: 'client/shared/directives/nxg-footer/footer.template.html',
      controller: 'FooterCtrl'
    };

  }
})();