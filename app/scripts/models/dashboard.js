'use strict';

angular.module('nextgearWebApp')
  .factory('Dashboard', function ($q, $filter, api) {

    var prv = {
      getReceiptURL: function (transactionId) {
        return api.contentLink('/receipt/view/' + transactionId);
      }
    };

    return {
      fetchDealerDashboard: function (startDate, endDate) {
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
                return accumulator + (payment.ScheduledPaymentAmount || payment.PaymentDue || payment.PayoffDue);
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
              if (payment.PayoffDue) {
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

            _.each(
              response.Points,
              function (point) {
                  result.labels.push(point.X);
                  result.datasets[0].data.push(point.Y);
                }
            );

            return result;
          }
        );
      }
    };
  });
