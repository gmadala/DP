'use strict';

angular.module('nextgearWebApp')
  .directive('nxgSortable', function () {
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
  });
