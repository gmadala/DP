'use strict';

angular.module('nextgearWebApp')
  .directive('nxgSticky', function () {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs, $window, $document) {
        var win = angular.element($window),
            doc = angular.element($document),
            el = angular.element($element), // our element that needs to move
            offset = el.offset(), // element's initial offset from window top
            topSpacing = 15, // amount of space we want at top of element
            bottomSpacing = 15, // amount of space we want at bottom of element
            bottomElMargin = 20, // bottom margin for when we're at the bottom of the page
            footerHeight = 50; // size of footer that we need to account for in our calculations

        $scope.lock = false;

        $scope.getMaxAllowableElHeight = function() {
          return $window.innerHeight - topSpacing - bottomSpacing;
        };

        $scope.getElHeight = function() {
          return el.outerHeight();
        };

        $scope.$watch($scope.getElHeight, function(newHeight) {
          $scope.lock = true;
          $scope.adjustScroll(newHeight);
          $scope.sizeCallback();

        });

        $scope.adjustScroll = function(h) {
          if ($scope.lock) {
            el.css('overflow-y', 'visible');
            el.css('overflow-x', 'hidden');
            if ($scope.getMaxAllowableElHeight() <= h) { // make element scrollable when it becomes too long
              el.css('max-height', $scope.getMaxAllowableElHeight() + 'px');
              el.css('overflow-y', 'scroll');
              el.css('overflow-x', 'hidden');
            } else { // take away scollbar when element doesn't need it
              el.css('max-height', '');
              el.css('overflow-y', 'visible');
              el.css('overflow-x', 'visible');
            }
          }

          $scope.lock = false;
        };

        win.bind('resize', function() {
          // if the window height is smaller or equal to the element height, adjust the element height (shrink)
          if ($window.innerHeight <= ($scope.getElHeight() + topSpacing + bottomSpacing + footerHeight)  ) {
            $scope.lock = true;
            $scope.adjustScroll($window.innerHeight);
          } else if ($window.innerHeight > $scope.getMaxAllowableElHeight()) {
            // if the window height is bigger than the element height, also adjust the height (expand)
            $scope.lock = true;
            $scope.adjustScroll($scope.getElHeight);
          }

          $scope.$apply();
        });

        $scope.sizeCallback = function() {
          if (win.scrollTop() > offset.top) {
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
            el.stop().animate({
              marginTop: 0
            });
          }
        };

        win.bind('scroll', function() {
          $scope.sizeCallback();
        });
      }
    };
  });
