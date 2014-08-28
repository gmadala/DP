'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $state, $dialog, $log, Dashboard, Floorplan, FloorplanUtil, segmentio, metric, moment, $filter) {

    segmentio.track(metric.VIEW_DASHBOARD);


    $scope.viewMode = 'week';
    $scope.today = moment().format('MMMM D, YYYY');

    // FloorplanUtil handles all search/fetch/reset functionality.
    $scope.floorplanData = new FloorplanUtil('FlooringDate');
    // initial search
    $scope.floorplanData.resetSearch();

    $scope.changeViewMode = function(mode) {
      $scope.viewMode = mode;
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
      var now = angular.element('.dash-calendar').fullCalendar('getDate');

      if (now.getFullYear() > new Date().getFullYear() || now.getMonth() > new Date().getMonth()) {
        return false;
      } else {
        return true;
      }
    };

    $scope.getCalendarTitle = function() {
      var now = angular.element('.dash-calendar').fullCalendar('getDate');
      return moment(now).format('MMMM YYYY');
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

    // Determines if the length of the rendered number is too long
    // to fit inside the pie charts on the dashboard.
    // This method is a terrible separation of view/controller, but
    // it's necessary to shrink numbers that don't fit.
    // TODO: how can we make this work currently?
    $scope.tooLong = function(number, format) {
      if($filter('numeral')(number, format).length >= 7) {
        return true;
      } else {
        return false;
      }
    };

    $scope.filterPayments = function(filter) {
      var param;
      if(filter) {
        param = {filter: filter};
      }
      $state.transitionTo('home.payments', param);
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
        $scope.chartData.creditTitle.text = '<h1 class="chart-label-secondary color-success">' + $filter('numeral')(newValue.AvailableCreditAmount, '($0[.]0a)') + '</h1> <p class="chart-label-primary">available</p>' ;
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

          var viewAllCredit = {
            'CreditTypeName': 'View All',
            'LineOfCreditId': '0',
            'LineOfCreditAmount': 0,
            'TempLineOfCreditAmount': 0,
            'TempLineOfCreditExpiration': null,
            'AvailableCreditAmount': 0,
            'UtilizedCreditAmount': 0,
            'CreditChartData' :{
              outer: [
                { color: '#9F9F9F', y: 0 },
                { color: '#575757', y: 0 }
              ],
              inner: [
                { color: '#3D9AF4', y: 0 },
                { color: '#54BD45', y: 0 }
              ]
            }
          };

          $scope.dashboardData = result;
          $scope.dashboardData.selectedLineOfCredit = $scope.dashboardData.LinesOfCredit[0];
          $scope.creditLineOpts = [viewAllCredit];
          $scope.dashboardData.LinesOfCredit.unshift(viewAllCredit); // add viewAllCredit to the beginning of LinesOfCredit array.

          if ($scope.dashboardData.selectedLineOfCredit.TempLineOfCreditExpiration != null ) {
              $scope.dashboardData.selectedLineOfCredit.CreditTypeName = $scope.dashboardData.selectedLineOfCredit.CreditTypeName + ' ( temp )';
          }

          /* Loop through all of the Lines of Credit */
          for (var i = 0; i < $scope.dashboardData.LinesOfCredit.length; i++) {
            var selectedViewAll = $scope.dashboardData.LinesOfCredit[i];
            var allCreditUtilized = (selectedViewAll.LineOfCreditAmount + selectedViewAll.TempLineOfCreditAmount) - selectedViewAll.AvailableCreditAmount;

            $scope.creditLineOpts.push($scope.dashboardData.LinesOfCredit[i]);

            /* set the Chart values for View All select option */
            viewAllCredit.CreditChartData.outer[0].y +=  selectedViewAll.LineOfCreditAmount;
            viewAllCredit.CreditChartData.outer[1].y +=  selectedViewAll.TempLineOfCreditAmount;
            viewAllCredit.CreditChartData.inner[0].y += allCreditUtilized;
            viewAllCredit.CreditChartData.inner[1].y += selectedViewAll.AvailableCreditAmount;

            viewAllCredit.LineOfCreditAmount += selectedViewAll.LineOfCreditAmount;
            viewAllCredit.TempLineOfCreditAmount += selectedViewAll.TempLineOfCreditAmount;
            viewAllCredit.AvailableCreditAmount += selectedViewAll.AvailableCreditAmount;
            viewAllCredit.UtilizedCreditAmount += allCreditUtilized;

          }

          $scope.chartData = {
            credit: $scope.dashboardData.selectedLineOfCredit.CreditChartData,
            payments: result.paymentChartData.chartData,
            creditTitle: {
              useHTML: true,
              floating: true,
              text: '<h1 class="chart-label-secondary color-success">' + $filter('numeral')($scope.dashboardData.selectedLineOfCredit.AvailableCreditAmount, '($0[.]0a)') + '</h1> <p class="chart-label-primary">available</p>',
              y: 70
            },
            paymentsTitle: {
              useHTML: true,
              floating: true,
              text:'<h2 class="center chart-label-primary">' + $filter('numeral')(result.paymentChartData.total, '($0[.]00a)') + '</h2><p class="center chart-label-secondary">This ' + $filter('capitalize')($scope.viewMode) + '</p>',
              y: 75
            }
          };
        }
      );
    });

  });
