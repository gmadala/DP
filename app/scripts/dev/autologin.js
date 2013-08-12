'use strict';

angular.module('nextgearWebApp')
  .run(function($location, User) {
    //https://effectiveui.basecamphq.com/projects/10178421-nextgear-desktop-and-mobile-internal/posts/77903221/comments
    User.authenticate('72694DC', 'weLoveEffectiveUI123@').then(function() {
      $location.path('/home');
    });
  });