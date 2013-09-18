'use strict';

/**
 * This is a somewhat hacky fix for an issue with the AngularUI tooltip directive.
 *
 * If the tooltip content is null/empty (e.g. as a result of interpolation) when
 * the event to show the tooltip occurs, the tooltip will not appear (a good thing).
 * However, if the tooltip is already showing when the content becomes null/empty,
 * it will be left hanging with no content, which looks really broken.
 */
angular.module('nextgearWebApp')
  .directive('tooltip', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        attrs.$observe('tooltip', function (newValue) {
          if (!newValue && scope.tt_isOpen) {
            // the content became empty with the tooltip showing; forcibly hide it
            scope.tt_isOpen = false;
            angular.element(window.document).find('.tooltip').remove();
          }
        });

      }
    };
  });
