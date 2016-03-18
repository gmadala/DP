(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgSortable', nxgSortable);

  nxgSortable.$inject = [];

  function nxgSortable() {

    return {
      template: '<div class="sortable-inner">' +
      '<span class="sortable-text">{{ sortableText }}</span>' +
      '<span class="sortArrows"></span></div>',
      restrict: 'E',
      replace: true,
      scope: {
        sortableText: '@'
      }
    };

  }
})();
