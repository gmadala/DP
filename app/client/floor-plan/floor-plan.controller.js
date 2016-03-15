(function() {
  'use strict';

  /**
   * WARNING: This controller is used for both dealer Floorplan AND auction Seller Floorplan. Understand
   * the ramifications to each view and test both when making any changes here!!
   */
  angular
    .module('nextgearWebApp')
    .controller('FloorplanCtrl', FloorplanCtrl);

  FloorplanCtrl.$inject = [
    '$scope',
    '$stateParams',
    'Floorplan',
    'FloorplanUtil',
    'User',
    '$timeout',
    'gettextCatalog',
    'Addresses'
  ];

  function FloorplanCtrl(
    $scope,
    $stateParams,
    Floorplan,
    FloorplanUtil,
    User,
    $timeout,
    gettextCatalog,
    Addresses) {

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



    // Set up page-load filtering based on $stateParams
    var filterParam = null;

    switch($stateParams.filter) {
      case 'approved':
        filterParam = Floorplan.filterValues.APPROVED;
        break;
      case 'pending':
        filterParam = Floorplan.filterValues.PENDING;
        break;
      case 'denied':
        filterParam = Floorplan.filterValues.DENIED;
        break;
    }

    // initial search
    $scope.floorplanData.resetSearch(filterParam);

    $scope.showTooltip = function(sellerHasTitle, sellerHasTitleChanged) {
      if (!!sellerHasTitleChanged) {
        return true;
      } else if (!sellerHasTitle) {
        return true;
      }
    };

    $scope.hideTooltip = function(sellerHasTitle, sellerHasTitleChanged) {
      if (!!sellerHasTitleChanged) {
        return false;
      } else if (sellerHasTitle) {
        return true;
      }
    };

    $scope.sellerTimeouts = {};
    $scope.sellerHasTitle = function(floorplan, hasTitle) {
      if (!floorplan.sellerHasTitleChanged) {
        floorplan.sellerHasTitleChanged = !floorplan.sellerHasTitleChanged;
      }

      var toggleTooltip = function(possibleTT, hide) {
        if(possibleTT.hasClass('tooltip')) {
          // the tooltip div exists, so we need to make sure its
          // completely gone or properly brought back
          var displayVal = hide ? 'none' : '';
          possibleTT.css('display', displayVal);
        }
      };

      Floorplan.sellerHasTitle(floorplan.FloorplanId, hasTitle).then(
        function() {
          if ($scope.sellerTimeouts[floorplan.FloorplanId]) {
            // cancel any previous timeouts before setting a new one.
            $timeout.cancel($scope.sellerTimeouts[floorplan.FloorplanId]);
          }

          $scope.sellerTimeouts[floorplan.FloorplanId] = $timeout(function() {
            var curFloorplan = angular.element('#' + floorplan.FloorplanId + '+ label');
            toggleTooltip(curFloorplan.next(), true);
          }, 2000);

          // real purpose of this function
          floorplan.TitleLocation = hasTitle ? gettextCatalog.getString('Seller') : gettextCatalog.getString('Title Absent');
        }
      );
    };

  }
})();
