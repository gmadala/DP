'use strict';

/**
 * This is based on the ngInfiniteScroll directive (http://binarymuse.github.io/ngInfiniteScroll/). The ngInfiniteScroll
 * directive is constrained to the windows bottom and will not work with popups or list that don't extend to the bottom
 * of the window. This variant works by using the scrollHeight and scrollTop properties to figure out when to load more
 * data.
 */
angular.module('nextgearWebApp')
  .directive('nxgInfiniteScroll', function($rootScope, $timeout) {
      var container = null;

      return {
        link: function(scope, elem, attrs) {
          var checkWhenEnabled, handler, scrollDistance, scrollEnabled;

          container = elem;
          scrollDistance = 0;

          if (attrs.nxgInfiniteScrollDistance !== null) {
            scope.$watch(attrs.nxgInfiniteScrollDistance, function(value) {
              value = parseInt(value, 10);
              if (!isNaN(value)) {
                scrollDistance = value;
              }
              return scrollDistance;
            });
          }
          scrollEnabled = true;
          checkWhenEnabled = false;
          if (attrs.nxgInfiniteScrollDisabled !== null) {
            scope.$watch(attrs.nxgInfiniteScrollDisabled, function(value) {
              scrollEnabled = !value;
              if (scrollEnabled && checkWhenEnabled) {
                checkWhenEnabled = false;
                return handler();
              }
            });
          }
          handler = function() {
            var scrollHeight, scrollTop, remaining, shouldScroll;

            scrollHeight = container[0].scrollHeight;
            scrollTop = container.scrollTop();
            remaining = scrollHeight - scrollTop - container[0].offsetHeight;
            shouldScroll = remaining <= scrollHeight * scrollDistance;

            if (shouldScroll && scrollEnabled) {
              if ($rootScope.$$phase) {
                return scope.$eval(attrs.nxgInfiniteScroll);
              } else {
                return scope.$apply(attrs.nxgInfiniteScroll);
              }
            } else if (shouldScroll) {
              checkWhenEnabled = true;
              return checkWhenEnabled;
            }
          };
          container.on('scroll', handler);

          scope.$on('$destroy', function() {
            return container.off('scroll', handler);
          });
          return $timeout(function() {
            if (attrs.nxgInfiniteScrollImmediateCheck) {
              if (scope.$eval(attrs.nxgInfiniteScrollImmediateCheck)) {
                return handler();
              }
            } else {
              return handler();
            }
          }, 0);
        }
      };
    });

