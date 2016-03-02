'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionSettingsCtrl', function($scope, $sce) {
    // Parent Scope for Profile Settings and Account Management
    // for when showing Auction user settings page
    $scope.passwordTooltip = $sce.trustAsHtml('<h5>Password Reset</h5><p>Passwords must consist of a minimum of 8 characters.</p><p>Passwords must contain 3 of the 4 following types of characters: uppercase, lowercase, number, or special characters.</p>');
  });
