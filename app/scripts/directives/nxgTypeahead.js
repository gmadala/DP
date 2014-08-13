'use strict';
/**
 * U G L Y you ain't got no alibi, you UGLY.
 *
 * This is a terribly hack, but it's required until angular-strap is changed.
 * If it's ever changed (eg upgraded to native Angular version), this
 * directive SHOULD be removed.
 *
 * Built to fix bug VO-2621
 */
angular.module('nextgearWebApp')
  .directive('nxgTypeahead', function ($compile) {
    return {
      restrict: 'A',
      priority: 1000,
      terminal: true,
      compile: function(element, attrs) {

        element.attr('typeahead', attrs.nxgTypeahead);
        element.attr('typeahead-open', 'isTypeaheadOpen' + attrs.id);
        element.removeAttr('nxg-typeahead');
        element.removeAttr('data-nxg-typeahead');

        return function postLink(scope, element) {


          // Capture any enter keypress. If typahead picker is showing, stop the
          // propagation of the enter keypress (going to the nxg-enter directive
          // and closing the typeahead popup) and instead rebroadcast a TAB
          // keypress, which will close the typeahead but not run nxg-enter method
          element.on('keydown keypress', function(event) {

            var typeaheadPickerShowing = scope['isTypeaheadOpen' + attrs.id];
            if(event.keyCode === 13 && typeaheadPickerShowing) {
              event.stopImmediatePropagation();
              if(event.type === 'keypress') {
                element.trigger({
                  type: 'keydown',
                  which: 9
                });
              }
            }
          });

          $compile(element)(scope);
        };

      }
    };
  });
