'use strict';

angular.module('nextgearWebApp')
  .factory('Analytics', function ($q, $filter, api) {

    return {

      fetchBusinessSummary: function() {
        return api.request('GET', '/dealer/summary').then(
          function (response) {

            // Calculate a couple of client-side derived values needed later and append it to the marshalled response
            response.DerivedCapitalBook = response.TotalOutstandingPrincipal / response.TotalApprovedPurchasePrice * 100;
            response.DerivedAmountOutstanding = response.TotalOutstandingPrincipal / response.TotalApprovedBlackBookValue * 100;

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

              var monthAbbrevs = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

              var result = {};

              // Parse average turn time into a model suitable for charting
              result.averageTurn = { labels: [], datasets: [ { fillColor: '#009EFF', data: [] } ] };
              _.each(
                responses[0],
                function ( item ) {
                  var month = parseInt(item.EndOfMonthDate.split('-')[1], 10);
                  var monthStr = monthAbbrevs[month];
                  result.averageTurn.labels.push(monthStr);
                  result.averageTurn.datasets[0].data.push(item.AvgTurnTimeForVehiclesCompletedIn60DaysPrior);
                }
              );

              // Parse aging data into a segmented counts
              result.aging = [0, 0, 0, 0];
              _.each(
                responses[1],
                function ( item ) {
                  var age = item.DaysOnFloor;
                  if (age >= 100 && age <= 125) {     result.aging[3]++; }
                  else if (age >= 75 && age <= 99) {  result.aging[2]++; }
                  else if (age >= 50 && age <= 74) {  result.aging[1]++; }
                  else if (age <= 25) {               result.aging[0]++; }
                }
              );

              result.top10Auctions = { labels: [], datasets: [ { fillColor: '#009EFF', data: [] } ] };

              // Sort by NumVehiclesAnalyzed and trim down to the top ten auctions
              var top10 = _.sortBy(
                responses[2],
                'NumVehiclesAnalyzed'
              ).reverse().slice(0, 10);

              // And create a model suitable for charting from the top ten items
              _.each(
                top10,
                function ( item ) {
                  result.top10Auctions.labels.push(item.SellerName);
                  result.top10Auctions.datasets[0].data.push(item.NumVehiclesAnalyzed);
                }
              );

              return result;

            }
        );
      },

      fetchMovers: function(isTop) {
        return api.request('GET', 'analytics/makemodelanalysis/' + (isTop ? 'true' : 'false')).then(
          function (response) {

            var result = { labels: [], makes: [], models: [], datasets: [ { fillColor: '#009EFF', data: [] } ] };

            _.each(
              response.reverse(),
              function ( item, index ) {
                result.labels.push(index);
                result.makes.push(item.Make);
                result.models.push(item.Model);
                result.datasets[0].data.push(item.NinetyFifthPercentileTurnTime);
              }
            );

            return result;
          }
        );
      },

      fetchTopAuctions: function() {
        return api.request('GET', 'analytics/bookvaluemargins/12').then(
          function (response) {
            return response;

          }
        );
      },

    };
  });
