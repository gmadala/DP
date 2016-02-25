'use strict';

/**
 * This directive differs in several ways from the native HTML5 "autofocus" attribute:
 *
 * - It works in IE9
 * - It works in Firefox when the element was added to page as part of a DOM change (without top-level document load)
 * - It can be applied to a parent container and it will find the first enclosed input or button element (by DOM order)
 * - It accepts an optional list of event names that can be used to trigger re-focus at a later time (e.g. on form reset)
 */
angular.module('nextgearWebApp')
  .directive('nxgAutofocus', function ($timeout) {
    return {
      restrict: 'AC',
      link: function (scope, element, attrs) {
        var elementName = element[0].tagName.toLowerCase(),
          target = null;

        setTimeout(function(){
          // find the first item that's an input or button or a link
          if (elementName === 'input' || elementName === 'button' || elementName === 'a') {
            target = element;
          } else {
            var focusable = element.find('input, button, a:visible');
            if (focusable.length > 0) {
              target = angular.element(focusable[0]);
            }
          }

          if (!target) {
            return;
          }

          angular.element(document).ready(function () {
            target.focus(); // sometimes this one works...
            $timeout(function () {
              target.focus(); // ... and sometimes this one works
            });
          });

          // listen for the designated re-focus events, if any
          if (attrs.nxgAutofocus) {
            var events = attrs.nxgAutofocus.split(',');
            angular.forEach(events, function (event) {
              scope.$on(event, function () {

                // Focus, blur, and refocus.
                // This is a workaround for a bug in firefox,
                // https://bugzilla.mozilla.org/show_bug.cgi?id=598819
                // It doesn't affect any other browser
                target.focus();
                $timeout(function() {
                  target.blur();
                  $timeout(function() {
                    target.focus();
                  });
                });

              });
            });
          }
        }, 0);
      }
    };
  });
