(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('Analytics', Analytics);

  Analytics.$inject = ['$q', '$filter', 'api', 'moment'];

  function Analytics($q, $filter, api, moment) {

    return {

      fetchBusinessSummary: function() {
        return api.request('GET', '/dealer/summary').then(
          function (response) {

            // Calculate a couple of client-side derived values needed later and append it to the marshalled response
            response.DerivedCapitalBook = response.TotalApprovedBlackBookValue / response.TotalApprovedPurchasePrice * 100;
            response.DerivedAmountOutstanding = response.TotalOutstandingPrincipal / response.TotalApprovedBlackBookValue * 100;
            response.DerivedPendingBook = response.TotalPendingBlackBookPrice / response.TotalPendingPurchasePrice * 100;

            // If we got NaN or Infinity from either of these calculations, just make them 0
            // (not totally mathematically accurate, but avoids a missing value in the UI)
            if (!isFinite(response.DerivedCapitalBook)) {
              response.DerivedCapitalBook = 0;
            }
            if (!isFinite(response.DerivedAmountOutstanding)) {
              response.DerivedAmountOutstanding = 0;
            }
            if (!isFinite(response.DerivedPendingBook)) {
              response.DerivedPendingBook = 0;
            }

            return response;
          }
        );
      },

      fetchAnalytics: function() {
        return $q.all([
          api.request('GET', '/analytics/averageturntime'),
          api.request('GET', '/analytics/aging'),
          api.request('GET', '/analytics/bookvaluemargins/12')
        ]).then(
          function (responses) {

            var result = {};

            // Parse average turn time into a model suitable for charting
            result.averageTurn = {
              data: []
            };
            _.each(
              _.sortBy(responses[0], 'EndOfMonthDate'),
              function ( item ) {
                var fmt, date = moment(item.EndOfMonthDate);
                fmt = date.month() === 0 ? 'MMM \'YY' : 'MMM';
                result.averageTurn.data.push([date.format(fmt), item.AvgTurnTimeForVehiclesCompletedIn60DaysPrior]
                );
              }
            );

            // Parse aging data into a segmented counts
            result.aging = [0, 0, 0, 0, 0, 0];
            _.each(
              responses[1],
              function ( item ) {
                var age = item.DaysOnFloor;
                if (age >= 100)                  {  result.aging[5]++; }
                else if (age >= 75 && age <= 99) {  result.aging[4]++; }
                else if (age >= 50 && age <= 74) {  result.aging[3]++; }
                else if (age >= 25 && age <= 49) {  result.aging[2]++; }
                else if (age >= 1 && age <= 24)  {  result.aging[1]++; }
                else if (age >= 0)               {  result.aging[0]++; }
              }
            );

            // Parse book value margins data into a model suitable for charting and all auctions modal
            result.allAuctions = _.sortBy(responses[2], 'NumVehiclesAnalyzed').reverse(); // sort descending

            // trim down to the top ten for chart
            var top10 = result.allAuctions.slice(0, 10);
            result.top10Auctions = [];

            _.each(
              top10,
              function ( item ) {
                result.top10Auctions.push([item.SellerName, item.NumVehiclesAnalyzed]);
              }
            );

            return result;

          }
        );
      },

      fetchMovers: function(isTop) {
        return api.request('GET', '/analytics/makemodelanalysis/' + (isTop ? 'true' : 'false')).then(
          function (response) {

            var result = {labels: [], data: []};

            response = _.sortBy(response, 'NinetyFifthPercentileTurnTime');
            if (!isTop) {
              response.reverse();
            }

            _.each(
              response,
              function ( item ) {
                result.labels.push({
                  model: item.Model,
                  year: item.Year,
                  make: item.Make
                });
                result.data.push([item.Make+' '+item.Model, item.NinetyFifthPercentileTurnTime]);
              }
            );
            return result;
          }
        );
      }
    };

  }
})();
