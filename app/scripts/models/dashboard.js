'use strict';

angular.module('nextgearWebApp')
  .factory('Dashboard', function ($q, $filter, api, moment) {

    var prv = {
      getReceiptURL: function (transactionId) {
        return api.contentLink('/receipt/view/' + transactionId + '/Receipt');
      }
    };

    return {
      fetchDealerDashboard: function (startDate, endDate) {

        // When fetching a month it also grabs the first day of the next month.
        // This line prevents that from happening.
        endDate = moment(endDate).subtract('days', 1).toDate();

        startDate = api.toShortISODate(startDate);
        endDate = api.toShortISODate(endDate);

        return $q.all([
            api.request('GET', '/dealer/buyer/dashboard/' + startDate + '/' + endDate),
            api.request('GET', '/payment/possiblePaymentDates/' + startDate + '/' + endDate)
          ]).then(function (responses) {
            // result looks like response object for /dealer/buyer/dashboard, with some added calculated properties
            var result = responses[0];

            // calculate .creditChartData
            result.creditChartData = {
              outer: [
                { color: '#9F9F9F', value: result.LineOfCredit },
                { color: '#575757', value: result.TempLineOfCredit }
              ],
              inner: [
                { color: '#3D9AF4', value: result.UtilizedCredit },
                { color: '#54BD45', value: result.AvailableCredit }
              ]
            };

            // inserting view receipt URLs
            angular.forEach(result.Receipts, function(receipt) {
              receipt.$receiptURL = prv.getReceiptURL(receipt.FinancialTransactionId);
            });

            // calculate .paymentChartData
            var scheduledPaymentAmount = result.ScheduledPayments.reduce(function (prev, current) {
              return prev + current.ScheduledPaymentAmount;
            }, 0);

            result.paymentChartData = {
              fees: result.AccountFeeAmount,
              payments: result.UpcomingPaymentsAmount - scheduledPaymentAmount, // we just want UN-scheduled payments
              scheduledPayments: scheduledPaymentAmount,
              total: result.AccountFeeAmount + result.UpcomingPaymentsAmount,
              // @see http://www.chartjs.org/docs/#pieChart-dataStructure
              chartData: [
                { color: '#444444', value: result.AccountFeeAmount },                               // Fees
                { color: '#2286f5', value: result.UpcomingPaymentsAmount - scheduledPaymentAmount }, // Payments
                { color: '#3fb232', value: scheduledPaymentAmount }                                 // Scheduled Payments
              ]
            };

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
              dateKey,
              list,
              sumPayments = function (accumulator, payment) {
                return accumulator + (payment.ScheduledPaymentAmount || payment.PaymentDue);
              },
              addEvent = function (sourceList, destList, singularLabel, pluralLabel, dateKey) {
                if (sourceList.length === 0) { return; }
                var event = {
                  title: '<span class="nxg-calendar-count">' + sourceList.length + '</span>' +
                    (sourceList.length === 1 ? singularLabel : pluralLabel),
                  subTitle: formatMoney(sourceList.reduce(sumPayments, 0)),
                  start: dateKey
                };
                destList.push(event);
                list = eventsByDate[dateKey] || (eventsByDate[dateKey] = []);
                list.push(event);
              };

            // aggregate due payments list into a set of calendar events, max 2 per day, summarizing payments & payoffs due that day
            dateMap = {};
            dueRaw.forEach(function (payment) {
              dateKey = payment.DueDate;
              list = dateMap[dateKey] || (dateMap[dateKey] = { payments: [], payoffs: [] });
              if (payment.PaymentDue === payment.PayoffDue) {
                list.payoffs.push(payment);
              } else {
                list.payments.push(payment);
              }
            });
            for (var key in dateMap) {
              addEvent(dateMap[key].payments, dueEvents, ' Payment Due', ' Payments Due', key);
              addEvent(dateMap[key].payoffs, dueEvents, ' Payoff Due', ' Payoffs Due', key);
            }

            // aggregate scheduled payments list into a set of calendar events, max 1 per day, summarizing payments scheduled that day
            dateMap = {};
            scheduledRaw.forEach(function (payment) {
              dateKey = payment.ScheduledDate;
              list = dateMap[dateKey] || (dateMap[dateKey] = []);
              list.push(payment);
            });
            for (var key2 in dateMap) {
              addEvent(dateMap[key2], scheduledEvents, ' Scheduled', ' Scheduled', key2);
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
        return api.request('GET', '/dealer/seller/dashboard');
      },

      fetchFloorplanChartData: function (range) {
        if (!angular.isNumber(range) || range < 0 || range > 2 || Math.floor(range) !== range) {
          throw 'Invalid range for /floorplan/getChartData/, must be int in range 0-2';
        }

        return api.request('GET', '/Floorplan/getChartData/' + range).then(
          function (response) {

            // Prepare a data model appropriate for charting from the points returned
            var result = {

              labels: [],
              datasets: [
                {
                  fillColor: 'rgba(0, 0, 0, 0)',
                  strokeColor: '#009EFF',
                  data: []
                }
              ]
            };

            // ensure data points are ordered along the X axis
            var points = _.sortBy(response.Points, 'X');

            // calculate the X axis label for each point
            // input: [0, 1, 2] (X values are indices where highest value represents current month/week/day)
            // result: ["2 units before now", "1 unit before now", "now"] (unit & format varies based on range)
            var nowValue = points[points.length - 1].X,
              now, stepUnit, fmt;

            if (range === 0) {
              stepUnit = 'day'; // days in week
              fmt = 'ddd'; // Sun, Mon...
            } else if (range === 1) {
              stepUnit = 'week'; // weeks in month
              fmt = 'MMM DD'; // Sep 29, Oct 6...
            } else if (range === 2) {
              stepUnit = 'month'; // months in year
              fmt = 'MMM \'YY'; // Jan '13, Feb '13...
            }

            now = moment().startOf(stepUnit);

            angular.forEach(points, function (point) {
              var stepsBeforeNow = nowValue - point.X,
                then = now.clone().subtract(stepUnit + 's', stepsBeforeNow);
              point.$label = then.format(fmt);
            });

            _.each(
              points,
              function (point) {
                  result.labels.push(point.$label);
                  result.datasets[0].data.push(point.Y);
                }
            );

            return result;
          }
        );
      }
    };
  });
