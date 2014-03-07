'use strict';

/**
 * This is a gross, browser-sniffing hack to try and avoid the major IE 10/11 64-bit crashing bug outlined at:
 * http://connect.microsoft.com/IE/feedback/details/808033/
 *
 * The bug seems to be triggered by repeatedly setting text input elements' values to '', so this
 * directive replaces the normal $render() function provided to ngModelController by the input[type=text]
 * Angular directive, with one that uses a space (' ') for empty model values. The built-in directive
 * performs a trim before updating the model, so this should have no functional effect other than
 * adding goofy-looking whitespace in the UI.
 *
 * This directive should be removed once Microsoft has released a fix for this issue.
 */
(function (window) {
  var ua = window.navigator.userAgent.toLowerCase(),
    isIE10or11 = ua.indexOf('trident/6.0') >= 0 || ua.indexOf('trident/7.0') >= 0;
    // is64bit = ua.indexOf('win64') >= 0 || ua.indexOf('wow64') >= 0;

  if (isIE10or11) {
    angular.module('nextgearWebApp')
      .directive('input', function () {
        var isEmpty = function(value) {
          return angular.isUndefined(value) || value === '' || value === null || value !== value;
        };

        return {
          restrict: 'E',
          require: '?ngModel',
          priority: -10,
          link: function(scope, element, attr, ctrl) {
            if (ctrl && angular.lowercase(attr.type) === 'text') {
              var renderFn;

              if (ctrl.$render) {
                renderFn = ctrl.$render;
              }

              ctrl.$render = function() {
                element.val(isEmpty(ctrl.$viewValue) ? ' ' : ctrl.$viewValue);

                if (renderFn) {
                  renderFn();
                }
              };
            }
          }
        };
      });
  }

}(window));


