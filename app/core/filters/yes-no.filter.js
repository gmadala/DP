(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('yesno', yesno);

  yesno.$inject = ['gettextCatalog'];

  function yesno(gettextCatalog) {

    return function(yesno) {
      return yesno ? gettextCatalog.getString('Yes') : gettextCatalog.getString('No');
    };

  }
})();
