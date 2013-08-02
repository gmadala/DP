'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api) {
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
            var dueRaw = responses[0].SearchResults || [],
              scheduledRaw = responses[1].SearchResults || [],
              possibleRaw = responses[2] || [],
              dueEvents = [],
              scheduledEvents = [],
              eventsByDate = {},
              openDates = {},
              formatDate = $filter('date'),
              formatMoney = $filter('currency'),
              iso = 'yyyy-MM-dd',
              dateMap,
              date,
              dateKey,
              list,
              reducer;

            // aggregate due payments list into a set of calendar events, max 1 per day, summarizing payments due that day
            dateMap = {};
            dueRaw.forEach(function (payment) {
              date = new Date(payment.DueDate * 1000);
              dateKey = formatDate(date, iso);
              list = dateMap[dateKey] || [];
              list.push(payment);
              dateMap[dateKey] = list;
            });
            reducer = function (summary, payment) {
              summary.count += 1;
              summary.total += payment.AmountDue;
              return summary;
            };
            for (var key in dateMap) {
              list = dateMap[key];
              date = list.reduce(reducer, {count: 0, total: 0});
              date = {
                title: date.count + (date.count === 1 ? ' Payment Due' : ' Payments Due'),
                subTitle: formatMoney(date.total),
                start: key
              };
              dueEvents.push(date);
              list = eventsByDate[key] || [];
              list.push(date);
              eventsByDate[key] = list;
            }

            // aggregate scheduled payments list into a set of calendar events, max 1 per day, summarizing payments scheduled that day
            dateMap = {};
            scheduledRaw.forEach(function (payment) {
              date = new Date(payment.ScheduledPaymentDate * 1000);
              dateKey = formatDate(date, iso);
              list = dateMap[dateKey] || [];
              list.push(payment);
              dateMap[dateKey] = list;
            });
            reducer = function (summary, payment) {
              summary.count += 1;
              // is this the right way to find the scheduled payment amount?
              summary.total += payment.IsPayoff ? payment.CurrentPayoff : payment.AmountDue;
              return summary;
            };
            for (var key2 in dateMap) {
              list = dateMap[key2];
              date = list.reduce(reducer, {count: 0, total: 0});
              date = {
                title: date.count + ' Scheduled',
                subTitle: formatMoney(date.total),
                start: key2
              };
              scheduledEvents.push(date);
              list = eventsByDate[key2] || [];
              list.push(date);
              eventsByDate[key2] = list;
            }

            // convert possiblePaymentDates into a map of 'yyyy-MM-dd': true
            possibleRaw.forEach(function (dateVal) {
              date = new Date(dateVal * 1000);
              dateKey = formatDate(date, iso);
              openDates[dateKey] = true;
            });

            return {
              dueEvents: dueEvents,
              scheduledEvents: scheduledEvents,
              eventsByDate: eventsByDate,
              openDates: openDates
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
      },
      fetchUpcomingPayments: function() {
        var promise = api.request('GET','/payment/search', {DueDateStart: (new Date().getTime())});
        
        return promise.then(function(results) {
          var upcomingPayments = results.SearchResults;
          for (var i = 0; i < upcomingPayments.length; i++) {
            // Dates coming from the service are in Unix time which are the number of seconds since 1/1/1970,
            // but the views expect it to be in milliseconds (e.g. Angular date filter)
            upcomingPayments[i].DueDate *= 1000;
            upcomingPayments[i].ScheduleSetupDate *= 1000;
          }
          return upcomingPayments;
        });
      }
    };
  });
