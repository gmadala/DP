(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgSticky', nxgSticky);

  nxgSticky.$inject = [];

  function nxgSticky() {

    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs, $window, $document, $timeout) {
        var win = angular.element($window),
          doc = angular.element($document),
          el = angular.element($element), // our element that needs to move
          scrollEl = el.find($attrs.scroll || '.nxg-sticky-scroll'), // the element that will scroll
          offset = el.offset(), // element's initial offset from window top
          topSpacing = 15, // amount of space we want at top of element
          bottomSpacing = 15, // amount of space we want at bottom of element
          bottomElMargin = 20, // bottom margin for when we're at the bottom of the page
          footerHeight = 50, // size of footer that we need to account for in our calculations
          heightOfElementHeader = 50, // Grey background header height
          heightOfElementFooter = 0; // Subtotal box height

        if($attrs.footer){
          $timeout(function() {
            heightOfElementFooter = angular.element($attrs.footer)[0].offsetHeight;
          });
        }

        if($attrs.header){
          $timeout(function() {
            heightOfElementHeader = angular.element($attrs.header)[0].offsetHeight;
          });
        }

        $scope.lock = false;

        $scope.getMaxAllowableElHeight = function() {
          // Shrink the view when we're at the header so the whole thing can still be seen.
          var headerVisible = offset.top - topSpacing - win.scrollTop();
          if(headerVisible < 0) {
            headerVisible = 0;
          }

          // Not working 100% bug free, so disabling for now.
          // Shrink the view when the footer is in view so the whole think can still be seen.
          // var footerVisible = $window.innerHeight + win.scrollTop() - doc.height() + footerHeight;
          // if(footerVisible < 0) footerVisible = 0;
          var footerVisible = 0;

          return $window.innerHeight - topSpacing - bottomSpacing - heightOfElementHeader - heightOfElementFooter - headerVisible - footerVisible;
        };

        $scope.getElHeight = function() {
          return el.outerHeight();
        };

        $scope.getScrollElHeight = function() {
          // This is bad - calling a DOM method inside a $watch method.
          // Should be refactored
          return scrollEl.outerHeight();
        };

        $scope.$watch($scope.getScrollElHeight, function(newHeight) {
          $scope.lock = true;
          $scope.adjustScroll(newHeight);
          $scope.sizeCallback();

        });

        $scope.adjustScroll = function(heightElementWantsToTakeUp) {
          if ($scope.lock) {
            scrollEl.css('overflow-y', 'visible');
            scrollEl.css('overflow-x', 'hidden');
            if ($scope.getMaxAllowableElHeight() <= heightElementWantsToTakeUp) { // make element scrollable when it becomes too long
              scrollEl.css('max-height', $scope.getMaxAllowableElHeight() + 'px');
              scrollEl.css('overflow-y', 'scroll');
              scrollEl.css('overflow-x', 'hidden');
            } else { // take away scollbar when element doesn't need it
              scrollEl.css('max-height', '');
              scrollEl.css('overflow-y', 'visible');
              scrollEl.css('overflow-x', 'visible');
            }
          }

          $scope.lock = false;
        };

        win.bind('resize', function() {
          // if the window height is smaller or equal to the element height, adjust the element height (shrink)
          if ($window.innerHeight <= ($scope.getScrollElHeight() + topSpacing + bottomSpacing + footerHeight)  ) {
            $scope.lock = true;
            $scope.adjustScroll($window.innerHeight);
          } else if ($window.innerHeight > $scope.getMaxAllowableElHeight()) {
            // if the window height is bigger than the element height, also adjust the height (expand)
            $scope.lock = true;
            $scope.adjustScroll($scope.getScrollElHeight());
          }

          $scope.$apply();
        });

        $scope.sizeCallback = function() {
          if (win.scrollTop() > offset.top - topSpacing) {
            // Not in view of header - scroll!

            var newElBottom = win.scrollTop() - offset.top + $scope.getElHeight() + bottomElMargin + bottomSpacing;
            var farthestDownBottomElCanBe = doc.height() - footerHeight - offset.top + 10;

            if (newElBottom >= farthestDownBottomElCanBe) {
              // if the bottom of the element is as far down as it can go
              newElBottom = farthestDownBottomElCanBe;
            }

            var newElTop = newElBottom - $scope.getElHeight() - bottomElMargin;

            el.stop().animate({
              marginTop: newElTop
            });

          } else {
            // In view of header

            el.stop().animate({
              marginTop: 0
            });

          }
          if(scrollEl.css('max-height') === 'none'){
            scrollEl.css({
              maxHight: $scope.getMaxAllowableElHeight() + 'px'
            });
          }else{
            scrollEl.css({
              maxHeight: $scope.getMaxAllowableElHeight() + 'px'
            });
          }

        };

        win.bind('scroll', function() {
          $scope.sizeCallback();
        });
      }
    };

  }
})();
