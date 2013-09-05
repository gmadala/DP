'use strict';

angular.module('nextgearWebApp')
  .factory('Dashboard', function ($q, $filter, api) {
    return {
      fetchDealerDashboard: function (startDate, endDate) {
        startDate = api.toShortISODate(startDate);
        endDate = api.toShortISODate(endDate);

        return $q.all([
            api.request('GET', '/dealer/buyer/dashboard/' + startDate + '/' + endDate),
            api.request('GET', '/payment/possiblePaymentDates/' + startDate + '/' + endDate)
          ]).then(function (responses) {
            // result looks like response object for /dealer/buyer/dashboard, with added .calendarData property
            var result = responses[0];

            // calculate .calendarData
            var dueRaw = responses[0].UpcomingPaymentsList || [],
              scheduledRaw = responses[0].ScheduledPayments || [],
              possibleRaw = responses[1] || [],
              dueEvents = [],
              scheduledEvents = [],
              eventsByDate = {},
              openDates = {},
              formatMoney = $filter('currency'),
              dateMap,
              date,
              dateKey,
              list,
              reducer;

            // aggregate due payments list into a set of calendar events, max 1 per day, summarizing payments due that day
            dateMap = {};
            dueRaw.forEach(function (payment) {
              dateKey = payment.DueDate;
              list = dateMap[dateKey] || [];
              list.push(payment);
              dateMap[dateKey] = list;
            });
            reducer = function (summary, payment) {
              summary.count += 1;
              summary.total += payment.PaymentDue || payment.PayoffDue;
              return summary;
            };
            for (var key in dateMap) {
              list = dateMap[key];
              date = list.reduce(reducer, {count: 0, total: 0});
              date = {
                title: '<span class="nxg-calendar-count">' + date.count + '</span>' + (date.count === 1 ? ' Payment Due' : ' Payments Due'),
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
              dateKey = payment.ScheduledDate;
              list = dateMap[dateKey] || [];
              list.push(payment);
              dateMap[dateKey] = list;
            });
            reducer = function (summary, payment) {
              summary.count += 1;
              // is this the right way to find the scheduled payment amount?
              summary.total += payment.PaymentDue || payment.PayoffDue;
              return summary;
            };
            for (var key2 in dateMap) {
              list = dateMap[key2];
              date = list.reduce(reducer, {count: 0, total: 0});
              date = {
                title: '<span class="nxg-calendar-count">' + date.count + '</span>' + ' Scheduled',
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
              dateKey = dateVal;
              openDates[dateKey] = true;
            });

            result.calendarData = {
              dueEvents: dueEvents,
              scheduledEvents: scheduledEvents,
              eventsByDate: eventsByDate,
              openDates: openDates
            };

            return result;
          });
      },
      fetchAuctionDashboard: function () {
        return api.request('GET', '/dealer/seller/dashboard/');
        // TODO: add any transformation needed
      }
    };
  });
