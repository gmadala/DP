'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $state, $dialog, $log, Dashboard, Floorplan, FloorplanUtil,
                                        moment, $filter, gettext, gettextCatalog, capitalizeFilter) {

    // for caching our week/month summary data
    $scope.paymentSummary = {
      month: null,
      week: null
    };

    $scope.viewMode = 'week';
    $scope.viewModeLabel = gettextCatalog.getString(capitalizeFilter($scope.viewMode));
    $scope.today = moment().format('LL');

    // FloorplanUtil handles all search/fetch/reset functionality.
    $scope.floorplanData = new FloorplanUtil('FlooringDate');
    // initial search
    $scope.floorplanData.resetSearch();

    $scope.changeViewMode = function(mode) {
      $scope.viewMode = mode;
      $scope.viewModeLabel = gettextCatalog.getString(capitalizeFilter($scope.viewMode));
    };

    $scope.isWeekMode = function() {
      return $scope.viewMode === 'week';
    };

    $scope.getDueStatus = function (payment) {
      var due = moment(payment.DueDate),
        today = moment();

      if (due.isBefore(today, 'day')) {
        return 'overdue';
      } else if (due.isSame(today, 'day')) {
        return 'today';
      } else {
        return 'future';
      }
    };

    $scope.isPast = function() {

      var currentCalendarDate = angular.element('.dash-calendar').fullCalendar('getDate');
      var today = new Date();

      if (currentCalendarDate.getFullYear() > today.getFullYear()) {
        return false;
      }

      if($scope.isWeekMode()) {
        if(moment(currentCalendarDate).week() > moment(today).week()) {
          return false;
        }
      } else {
        if(currentCalendarDate.getMonth() > today.getMonth()) {
          return false;
        }
      }

      return true;
    };

    $scope.getCalendarTitle = function() {
      var currentCalendarDate = angular.element('.dash-calendar').fullCalendar('getDate');
      return moment(currentCalendarDate).format('MMMM YYYY');
    };

    $scope.onClickPrev = function() {
      if (!$scope.isPast()) {
        angular.element('.dash-calendar').fullCalendar('prev');
      }
    };

    $scope.onClickNext = function() {
      angular.element('.dash-calendar').fullCalendar('next');
    };

    $scope.onClickToday = function() {
      angular.element('.dash-calendar').fullCalendar('today');
    };

    $scope.onRequestCredIncr = function() {
      var dialogOptions = {
        dialogClass: 'modal request-credit-increase',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'views/modals/requestCreditIncrease.html',
        controller: 'RequestCreditIncreaseCtrl'
      };

      $dialog.dialog(dialogOptions).open();
    };

    $scope.onClickButtonLink = function(newState) {
      $state.transitionTo(newState);
    };

    $scope.filterPayments = function(filter) {
      var param;
      switch(filter) {
      case 'week':
        filter = 'this-week';
        break;
      case 'month':
        filter = 'this-month';
        break;
      }

      if(filter) {
        param = {filter: filter};
      }
      $state.transitionTo('payments', param);
    };

    $scope.filterFloorplans = function(filter) {
      var param;

      if(filter) {
        param = {filter: filter};
      }
      $state.transitionTo('floorplan', param);
    };


    $scope.chartData = {};
    $scope.chartOptions =  {
      donutOptions: {
        size: '110%',
        innerSize: '104%',
        border: false,
        semiCircle: false
      },
      size: {
        height: '160',
        width: '160'
      },
      innerSize: {
        height: '138',
        width: '138'
      }
    };


    /**
     * Watch changes to the 'Line of Credit' select dropdown.
     * update the nxg-chart based on changes.
     */
    $scope.$watch('dashboardData.selectedLineOfCredit', function(newValue, oldValue){
      if (newValue !== oldValue) {
        $scope.chartData.credit = newValue.CreditChartData;
        $scope.chartData.creditTitle.text = '<h2 class="chart-label-primary color-success negative">' + $filter('numeral')(newValue.AvailableCreditAmount, '($0[.]0a)') + '</h2> <p class="chart-label-primary">' + gettextCatalog.getString('available') + '</p>' ;
      }
    });



    /**
     * Flow of control is a little weird here, because the calendar's current visible
     * date range controls what displays in several dashboard elements (and is a
     * required parameter for loading ANY and all dashboard data).
     *
     * As a result, flow goes like this: the viewMode gets set, or the user pages to a
     * different week or month in the calendar, which then causes the calendar to (re)render,
     * and when it does, it sends a notification with its new date range, which we then use to
     * drive (re)loading of all data, using that date range.
     */
    $scope.$on('setDateRange', function (event, startDate, endDate) {
      Dashboard.fetchDealerDashboard(startDate, endDate).then(
        function (result) {
          $scope.dashboardData = result;

          if($scope.dashboardData.LinesOfCredit.length === 1) {
            $scope.dashboardData.selectedLineOfCredit = $scope.dashboardData.LinesOfCredit[0];
          } else {
            var viewAllCredit = Dashboard.createLineOfCreditObject(gettextCatalog.getString('View All'));
            $scope.dashboardData.selectedLineOfCredit = viewAllCredit;
            $scope.dashboardData.LinesOfCredit.unshift(viewAllCredit); // add viewAllCredit to the beginning of LinesOfCredit array.

            /* Loop through all of the Lines of Credit */
            for (var i = 0; i < $scope.dashboardData.LinesOfCredit.length; i++) {
              var lineOfCredit = $scope.dashboardData.LinesOfCredit[i];
              var allCreditUtilized = lineOfCredit.LineOfCreditAmount - lineOfCredit.AvailableCreditAmount; // Temp lines LineOfCreditAmount gets updated in model layer to include temp amount.

              /* set calculated values for View All select option */
              viewAllCredit.LineOfCreditAmount += lineOfCredit.LineOfCreditAmount;
              viewAllCredit.TempLineOfCreditAmount += lineOfCredit.TempLineOfCreditAmount;
              viewAllCredit.AvailableCreditAmount += lineOfCredit.AvailableCreditAmount;
              viewAllCredit.UtilizedCreditAmount += allCreditUtilized;
            }
            viewAllCredit.updateChartData();
          }

          // if we haven't grabbed today's week data, get it now.
          if (!$scope.paymentSummary[$scope.viewMode]) {
            $scope.paymentSummary[$scope.viewMode] = {
              OverduePaymentAmount: result.OverduePaymentAmount,
              PaymentsDueTodayAmount: result.PaymentsDueTodayAmount,
              UpcomingPaymentsAmount: result.UpcomingPaymentsAmount,
              AccountFeeAmount: result.AccountFeeAmount,
              OverduePayments: result.OverduePayments,
              PaymentsDueToday: result.PaymentsDueToday,
              UpcomingPayments: result.UpcomingPayments,
              AccountFees: result.AccountFees
            };
          }

          function getPaymentsTitle () {

            // viewMode can be 'month' or 'week' so mark the Payments Title phrase for translation here
            gettext('This month');
            gettext('This week');

            // return the actual translation
            var paymentsTitle = 'This ' + $scope.viewMode;
            return gettextCatalog.getString(paymentsTitle);
          }

          $scope.chartData = {
            credit: $scope.dashboardData.selectedLineOfCredit.CreditChartData,
            payments: result.paymentChartData.chartData,
            creditTitle: {
              useHTML: true,
              floating: true,
              text: '<h1 class="chart-label-secondary color-success">' + $filter('numeral')($scope.dashboardData.selectedLineOfCredit.AvailableCreditAmount, '($0[.]0a)') + '</h1> <p class="chart-label-primary">' + gettextCatalog.getString('available') + '</p>',
              y: 70
            },
            paymentsTitle: {
              useHTML: true,
              floating: true,
              text:'<h2 class="center chart-label-primary">' + $filter('numeral')(result.paymentChartData.total, '($0[.]00a)') + '</h2><p class="center chart-label-secondary">' + getPaymentsTitle() + '</p>',
              y: 75
            }
          };
        }
      );
    });

  });
