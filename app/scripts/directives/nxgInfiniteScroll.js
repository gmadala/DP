'use strict';

/**
 * This is based on the ngInfiniteScroll directive (http://binarymuse.github.io/ngInfiniteScroll/). We've extended
 * it for the following cases:
 *
 * The ngInfiniteScroll directive is constrained to the window's bottom and will not work with popups or lists
 * that don't extend to the bottom of the window. This variant adds an nxg-scroll-container attribute; if present/true
 * it will use the scrollHeight and scrollTop properties of the directive's element to figure out when
 * to load more data. (Note that for this to work, you must have an overflow style of "scroll" or "auto" on the element,
 * and make sure that the first page of data that's loaded is big enough to go "below the fold" if additional
 * pages should be reachable).
 *
 * This adds an optional nxg-infinite-scroll-show-indicator attribute. If present, and the expression provided
 * evaluates to true, the directive will display a <div class="nxg-infinite-scroll-indicator"> at the bottom of the
 * directive's element. (Because of this, you should avoid using this directive on elements that should not have
 * <div> children, like <table> -- if you need scrolling in a table, you can put the table inside a div and put
 * the infinite-scroll there. If you don't want the headers to scroll, move those out to a second table above
 * and make sure their widths match their data columns).
 *
 * Disables some overly eager scroll handling logic that could cause 2 pages to be loaded at a time.
 */
angular.module('nextgearWebApp')
  .directive('nxgInfiniteScroll', function ($rootScope, $timeout, $window, status) {

    var windowShouldScroll = function (window, elem, scrollDistance) {
      var elementBottom, remaining, windowBottom;
      windowBottom = window.height() + window.scrollTop();
      elementBottom = elem.offset().top + elem.height();
      remaining = elementBottom - windowBottom;
      return remaining <= $window.height() * scrollDistance;
    };

    var containerShouldScroll = function (container, scrollDistance) {
      var scrollHeight, scrollTop, remaining;
      scrollHeight = container[0].scrollHeight;
      scrollTop = container.scrollTop();
      remaining = scrollHeight - scrollTop - container[0].offsetHeight;
      return remaining <= scrollHeight * scrollDistance;
    };

    return {
      link: function (scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled, container, indicator;

        if (!angular.isDefined(attrs.nxgScrollContainer) || attrs.nxgScrollContainer === 'false') {
          $window = angular.element($window);
          container = $window;
        } else {
          container = elem;
        }

        indicator = angular.element('<div class="nxg-infinite-scroll-indicator"></div>');
        elem.append(indicator);

        if (attrs.nxgInfiniteScrollShowIndicator !== null) {
          scope.$watch(attrs.nxgInfiniteScrollShowIndicator, function (show) {
            indicator.css('display', show ? 'block' : 'none');
            // suppress global app status display while showing the infinite scroll indicator
            if (show) {
              status.hide();
            } else {
              status.show();
            }
          });
        }

        scrollDistance = 0;

        if (attrs.nxgInfiniteScrollDistance) {
          scope.$watch(attrs.nxgInfiniteScrollDistance, function (value) {
            value = parseInt(value, 10);
            if (!isNaN(value)) {
              scrollDistance = value;
            }
            return scrollDistance;
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.nxgInfiniteScrollDisabled) {
          scope.$watch(attrs.nxgInfiniteScrollDisabled, function (value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function () {
          var shouldScroll;

          if (container === $window) {
            shouldScroll = windowShouldScroll($window, elem, scrollDistance);
          } else {
            shouldScroll = containerShouldScroll(container, scrollDistance);
          }

          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.nxgInfiniteScroll);
            } else {
              return scope.$apply(attrs.nxgInfiniteScroll);
            }
          } else if (shouldScroll) {
            // This seems inappropriate for our use case -
            // since we disable scrolling while data is loading,
            // setting a flag to handle the scroll event once
            // it becomes re-enabled will cause extra fetch requests
            // return checkWhenEnabled = true;
          }
        };
        container.on('scroll', handler);

        scope.$on('$destroy', function () {
          return container.off('scroll', handler);
        });
        return $timeout(function () {
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

