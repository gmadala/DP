'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, api) {
    return {
      fetchUpcomingCalendar: function(startDate, endDate) {
        // convert to UNIX epoch datetime values
        startDate = startDate.getTime();
        endDate = endDate.getTime();

        return $q.all([
            api.request('GET','/payment/search', {DueDateStart: startDate, DueDateEnd: endDate}),
            api.request('GET','/payment/searchscheduled', {StartDate: startDate, EndDate: endDate}),
            api.request('GET','/payment/possiblePaymentDates/'+startDate+'/'+endDate)
          ]).then(function(/*responses*/) {
            // TODO: Transform response data into daily summary events & open dates hash table
            return {
              dueEvents: [
                {title: '2 Payments Due', subTitle: '$5,000', start: '2013-08-01'},
                {title: '3 Payments Due', subTitle: '$8,000', start: '2013-08-07'}
              ],
              scheduledEvents: [
                {title: '2 Scheduled', subTitle: '$5,000', start: '2013-08-01'}
              ],
              eventsByDate: {
                '2013-08-01': [
                  {title: '2 Payments Due', subTitle: '$5,000', start: '2013-08-01'},
                  {title: '2 Scheduled', subTitle: '$5,000', start: '2013-08-01'}
                ],
                '2013-08-07': [
                  {title: '3 Payments Due', subTitle: '$8,000', start: '2013-08-07'}
                ]
              },
              openDates: {
                '2013-08-01': true,
                '2013-08-05': true,
                '2013-08-06': true,
                '2013-08-07': true,
                '2013-08-08': true,
                '2013-08-09': true
              }
            };
          });
      },
      fetchSummary: function() {
        // Placeholder until I can checkout Lucas' wireframe service mapping document
        return $q.all([]).then(function() {
          return {
            overdue:     {quantity: 1, amount: 3432.32},
            dueToday:    {quantity: 1, amount: 2859.02},
            thisWeek:    {quantity: 8, amount: 53592.71},
            accountFees: {quantity: 1, amount: 85.00}
          };
        });
      }
    };
  });
