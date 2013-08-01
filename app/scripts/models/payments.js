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
          ]).then(function(responses) {
            // TODO: Transform response data into daily summary events & open dates hash table
            return {
              dueEvents: [
                {title: '2 Payments Due\n$5,000', start: '2013-08-01'},
                {title: '3 Payments Due\n$8,000', start: '2013-08-07'}
              ],
              scheduledEvents: [
                {title: '2 Scheduled\n$5,000', start: '2013-08-01'}
              ],
              eventsByDate: {
                '2013-08-01': [
                  {title: '2 Payments Due\n$5,000', start: '2013-08-01'},
                  {title: '2 Scheduled\n$5,000', start: '2013-08-01'}
                ],
                '2013-08-07': [
                  {title: '3 Payments Due\n$8,000', start: '2013-08-07'}
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
      }
    }
  });
