'use strict';

angular.module('nextgearWebApp')
  .controller('SettingsCtrl', function($scope, $dialog, segmentio, metric) {
    segmentio.track(metric.VIEW_SETTINGS);

    // Parent Scope for Profile Settings and Account Management
    // until they can be broken out into 2 separate views
  });
