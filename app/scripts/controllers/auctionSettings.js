'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionSettingsCtrl', function($scope, $dialog, segmentio, metric) {
    segmentio.track(metric.VIEW_AUCTION_SETTINGS);

    // Parent Scope for Profile Settings and Account Management
    // for when showing Auction user settings page
  });
