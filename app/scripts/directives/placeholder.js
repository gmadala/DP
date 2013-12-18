'use strict';

/*global Modernizr:true*/

angular.module('nextgearWebApp')
  .directive('placeholder', ['$timeout', function ($timeout) {
    // check for placeholder support first
    if (Modernizr.input.placeholder === true) {
      return {};
    }
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var elem = angular.element(element); // raw DOM element

        // don't want password placeholders
        if ( attrs.type !== 'password' ) {
          $timeout(function() {
            elem.val( attrs.placeholder ).focus(function() {
              if (elem.val() === elem.attr('placeholder' )) {
                elem.val('');
              }
            }).blur( function() {
              if (elem.val() === '') {
                elem.val(elem.attr('placeholder'));
              }
            });
          });
        }
      }
    };
  }]);
