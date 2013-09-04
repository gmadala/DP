'use strict';

angular.module('nextgearWebApp')
  .factory('DealerCredit', function(api) {
    return {
      fetch: function() {
        return api.request('GET', '/dealer/credit').then(function(response) {

          return {
            availableCredit:  response.LinesOfCredit[0].CreditAvailable,
            utilizedCredit:   response.LinesOfCredit[0].Outstanding,
            tempLineOfCredit: response.LinesOfCredit[0].TemporaryCredit,
            lineOfCredit:     response.LinesOfCredit[0].ApprovedCredit,
            totalCredit:      response.LinesOfCredit[0].TotalCredit,
            chartData: {
              outer: [
                { color: '#9F9F9F', value: response.LinesOfCredit[0].ApprovedCredit },
                { color: '#575757', value: response.LinesOfCredit[0].TemporaryCredit }
              ],
              inner: [
                { color: '#3D9AF4', value: response.LinesOfCredit[0].Outstanding },
                { color: '#54BD45', value: response.LinesOfCredit[0].CreditAvailable }
              ]
            }
          };

        });
      }
    };
  });
