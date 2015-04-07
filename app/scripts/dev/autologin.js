'use strict';

angular.module('nextgearWebApp')
  .run(function($location, User) {
    var dest = $location.path();
    // List of valid credentials on URL below
    // https://effectiveui.basecamphq.com/projects/10178421-nextgear-desktop-and-mobile-internal/posts/77903221/comments
    User.authenticate('53190md', 'ngcpass!0')
      .then(function() {
        $location.path(dest || '/home');
      });
  });
