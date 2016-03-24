(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFillHeight', nxgFillHeight);

  nxgFillHeight.$inject = ['$window'];

  function nxgFillHeight($window) {

    var getAbsOffsetTop = function($elem) {
      var offsetTop = $elem[0].offsetTop;
      var ancestor = $elem.parent();

      while (ancestor.length > 0 && ancestor[0].offsetTop) {
        offsetTop += ancestor[0].offsetTop;
        ancestor = ancestor.parent();
      }
      return offsetTop;
    };

    return {
      restrict: 'A',
      link: function(scope, elem) {
        var updateHeight = function() {
          var offsetTop = getAbsOffsetTop(elem);
          var heightGap = $window.height() - offsetTop;
          elem.css({ height: heightGap + 'px', maxHeight: heightGap + 'px'});
        };
        elem.css({ 'overflow-y': 'auto', height: '1px' });
        $window = angular.element($window);
        $window.on('resize', updateHeight);

        // Execute whenever a digest cycle is started in case the element's height changed
        scope.$watch(function() {
          updateHeight();
        });
      }
    };

  }
})();
