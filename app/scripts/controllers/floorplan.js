'use strict';

/**
 * WARNING: This controller is used for both dealer Floorplan AND auction Seller Floorplan. Understand
 * the ramifications to each view and test both when making any changes here!!
 */
angular.module('nextgearWebApp')
  .controller('FloorplanCtrl', function($scope, $stateParams, Floorplan, FloorplanUtil, User, metric, $timeout, segmentio, gettextCatalog, Addresses) {

    $scope.metric = metric; // make metric names available to templates
    segmentio.track(metric.VIEW_FLOORPLAN_PAGE);
    $scope.isCollapsed = true;

    var isDealer = User.isDealer();

    if (isDealer) {
      $scope.filterOptions = [
        {
          label: gettextCatalog.getString('View All'),
          value: Floorplan.filterValues.ALL
        },
        {
          label: gettextCatalog.getString('Pending'),
          value: Floorplan.filterValues.PENDING
        },
        {
          label: gettextCatalog.getString('Denied'),
          value: Floorplan.filterValues.DENIED
        },
        {
          label: gettextCatalog.getString('Approved'),
          value: Floorplan.filterValues.APPROVED
        },
        {
          label: gettextCatalog.getString('Completed'),
          value: Floorplan.filterValues.COMPLETED
        }
      ];
    } else {
      // auction filters
      $scope.filterOptions = [
        {
          label: gettextCatalog.getString('View All'),
          value: Floorplan.filterValues.ALL
        },
        {
          label: gettextCatalog.getString('Pending/Not Paid'),
          value: Floorplan.filterValues.PENDING_NOT_PAID
        },
        {
          label: gettextCatalog.getString('Denied/Not Paid'),
          value: Floorplan.filterValues.DENIED_NOT_PAID
        },
        {
          label: gettextCatalog.getString('Approved/Paid'),
          value: Floorplan.filterValues.APPROVED_PAID
        },
        {
          label: gettextCatalog.getString('Approved/Not Paid'),
          value: Floorplan.filterValues.APPROVED_NOT_PAID
        },
        {
          label: gettextCatalog.getString('Completed/Paid'),
          value: Floorplan.filterValues.COMPLETED_PAID
        },
        {
          label: gettextCatalog.getString('Completed/Not Paid'),
          value: Floorplan.filterValues.COMPLETED_NOT_PAID
        },
        {
          label: gettextCatalog.getString('No Title/Paid'),
          value: Floorplan.filterValues.NO_TITLE_PAID
        }
      ];
    }

    // Grab inventory locations (floored against) to send to search directive
    $scope.inventoryLocations = Addresses.getFlooredBusinessAddresses();

    // FloorplanUtil handles all search/fetch/reset functionality.
    $scope.floorplanData = new FloorplanUtil('FlooringDate');

    // initial search
    $scope.floorplanData.resetSearch($stateParams.filter);

    $scope.sellerTimeouts = {};
    $scope.sellerHasTitle = function(floorplan, hasTitle) {
      /*jshint camelcase: false */
      var curFloorplan = angular.element('#' + floorplan.FloorplanId + '+ label');

      var toggleTooltip = function(possibleTT, hide) {
        if(possibleTT.hasClass('tooltip')) {
          // the tooltip div exists, so we need to make sure its
          // completely gone or properly brought back
          var displayVal = hide ? 'none' : '';
          possibleTT.css('display', displayVal);
        }
      };

      // prevent flash of tooltip when "i have title" is unchecked
      curFloorplan.scope().tt_isOpen = false;
      toggleTooltip(curFloorplan.next(), true);

      Floorplan.sellerHasTitle(floorplan.FloorplanId, hasTitle).then(
        function() {
          if (hasTitle) { // show the tooltip for 5 seconds, then fade
            curFloorplan.scope().tt_isOpen = true;
            toggleTooltip(curFloorplan.next(), false);

            if ($scope.sellerTimeouts[floorplan.FloorplanId]) {
              // cancel any previous timeouts before setting a new one.
              $timeout.cancel($scope.sellerTimeouts[floorplan.FloorplanId]);
            }

            $scope.sellerTimeouts[floorplan.FloorplanId] = $timeout(function() {
              curFloorplan.scope().tt_isOpen = false;
              toggleTooltip(curFloorplan.next(), true);
            }, 5000);
          }

          // real purpose of this function
          floorplan.TitleLocation = hasTitle ? gettextCatalog.getString('Seller') : gettextCatalog.getString('Title Absent');
        }
      );
    };
  });
