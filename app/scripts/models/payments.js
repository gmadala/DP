'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api, moment, Paginate, Floorplan, segmentio, metric) {

    // private global state:

    // provides caching such that we only have to request business hours data once per day;
    // use businessHours.resolve() in methods below to access the data via a promise
    var businessHours = {
      data: null,
      cacheDate: null,
      resolve: function () {
        if (!businessHours.cacheDate || !moment().isSame(businessHours.cacheDate, 'day')) {
          // we do not have business hours cached for the current date; fetch them now
          return api.request('GET', '/Info/businesshours').then(
            function (result) {
              businessHours.data = result;
              businessHours.cacheDate = moment();
              return result;
            }
          );
        } else {
          return $q.when(businessHours.data);
        }
      }
    };

    var paymentQueue = {
      fees: {},
      payments: {},
      unappliedFundsAvailable: 0,
      isEmpty: function () {
        return !(_.find(paymentQueue.fees) || _.find(paymentQueue.payments));
      }
    };

    // public api:

    return {
      requestUnappliedFundsPayout: function (amount, bankAccountId) {
        return api.request('POST', '/payment/payoutUnappliedFunds', {
          RequestAmount: api.toFloat(amount),
          BankAccountId: bankAccountId
        });
      },
      filterValues: {
        ALL: 'all',
        TODAY: 'today',
        THIS_WEEK: 'thisWeek',
        RANGE: 'range'
      },
      search: function(criteria, paginator) {
        var self = this;
        criteria = angular.copy(criteria);

        switch (criteria.filter) {
        case 'all':
          criteria.startDate = criteria.endDate = null;
          break;
        case 'today':
          criteria.startDate = criteria.endDate = new Date();
          break;
        case 'thisWeek':
          criteria.startDate = moment().startOf('week').toDate();
          criteria.endDate = moment().endOf('week').toDate();
          break;
        case 'range':
          // use dates as entered by user
        }

        var params = {
          Keyword: criteria.query || undefined,
          DueDateStart: api.toShortISODate(criteria.startDate) || undefined,
          DueDateEnd: api.toShortISODate(criteria.endDate) || undefined,
          OrderBy: 'DueDate',
          OrderByDirection: 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };
        return api.request('GET', '/payment/search', params).then(
          function (results) {
            self.setAvailableUnappliedFunds(results.AvailableUnappliedFundsBalance);
            angular.forEach(results.SearchResults, function (payment) {
              payment.data = {query: criteria.query};
              Floorplan.addTitleURL(payment);
            });
            return Paginate.addPaginator(results, results.PaymentRowCount, params.PageNumber, params.PageSize);
          }
        );
      },
      fetchFees: function () {
        return api.request('GET', '/payment/getaccountfees');
      },
      canPayNow: function () {
        return businessHours.resolve().then(function (hours) {
          var now = moment(),
            open = hours.StartDateTime || now,
            close = hours.EndDateTime || now;
          return (now.isAfter(open) && now.isBefore(close));
        });
      },
      addPaymentToQueue: function (floorplanId, vin, stockNum, description, amount, dueDate, asPayoff, revenue) {
        var payment = {
          floorplanId: floorplanId,
          vin: vin,
          stockNum: stockNum,
          description: description,
          amount: amount,
          dueDate: dueDate,
          isPayoff: asPayoff,
          revenueToTrack: revenue
        };
        paymentQueue.payments[floorplanId] = payment;
        segmentio.track(metric.ADD_TO_BASKET);
      },
      addFeeToQueue: function (financialRecordId, vin, type, description, amount, dueDate) {
        var fee = {
          financialRecordId: financialRecordId,
          type: type,
          vin: vin,
          description: description,
          amount: amount,
          dueDate: dueDate
        };
        paymentQueue.fees[financialRecordId] = fee;
        segmentio.track(metric.ADD_TO_BASKET);
      },
      removePaymentFromQueue: function (id) {
        delete paymentQueue.payments[id];
      },
      removeFeeFromQueue: function (id) {
        delete paymentQueue.fees[id];
      },
      isPaymentOnQueue: function (id) {
        var queueItem = paymentQueue.payments[id];

        if (!queueItem) {
          return false; // not in queue
        }
        else {
          // payment is on queue, return whether it is a payoff or payment
          return (queueItem.isPayoff ? 'payoff' : 'payment');
        }
      },
      isFeeOnQueue: function (id) {
        return !!paymentQueue.fees[id];
      },
      getPaymentQueue: function () {
        return {
          fees: paymentQueue.fees,
          payments: paymentQueue.payments,
          isEmpty: paymentQueue.isEmpty
        };
      },
      clearPaymentQueue: function () {
        angular.forEach(paymentQueue.fees, function (value, key) {
          delete paymentQueue.fees[key];
        });
        angular.forEach(paymentQueue.payments, function (value, key) {
          delete paymentQueue.payments[key];
        });
      },
      setAvailableUnappliedFunds: function (amount) {
        // a bit goofy - we don't have a dedicated endpoint to fetch this @ checkout, but
        // it comes back with other data earlier in the workflow, so remember it for later use
        paymentQueue.unappliedFundsAvailable = amount;
      },
      getAvailableUnappliedFunds: function () {
        return paymentQueue.unappliedFundsAvailable;
      },
      cancelScheduled: function (webScheduledPaymentId) {
        return api.request('POST', '/payment/cancelscheduledpayment/' + webScheduledPaymentId);
      },
      fetchPossiblePaymentDates: function (startDate, endDate, asMap) {
        startDate = api.toShortISODate(startDate);
        endDate = api.toShortISODate(endDate);
        return api.request('GET', '/payment/possiblePaymentDates/' + startDate + '/' + endDate).then(
          function (result) {
            if (!asMap) {
              return result;
            }

            var dateMap = {};
            result.forEach(function (date) {
              dateMap[date] = true;
            });
            return dateMap;
          }
        );
      },
      fetchPaymentAmountOnDate: function (floorplanId, scheduledDate, isPayoff) {
        var params = {
          FloorplanId: floorplanId,
          ScheduledDate: api.toShortISODate(scheduledDate),
          IsCurtailment: !isPayoff
        };
        return api.request('GET', '/payment/calculatepaymentamount', params).then(
          function (result) {
            return result.PaymentAmount;
          }
        );
      },
      checkout: function (fees, payments, bankAccount, unappliedFundsAmt) {
        var shortFees = [],
          shortPayments = [];
        angular.forEach(payments, function (payment) {
          shortPayments.push({
            FloorplanId: payment.floorplanId,
            ScheduledPaymentDate: api.toShortISODate(payment.scheduleDate) || null,
            IsPayoff: payment.isPayoff
          });
        });
        angular.forEach(fees, function (fee) {
          shortFees.push({
            FinancialRecordId: fee.financialRecordId
          });
        });

        var data = {
          SelectedFloorplans: shortPayments,
          AccountFees: shortFees,
          BankAccountId: bankAccount.BankAccountId,
          UnappliedFundsAmount: api.toFloat(unappliedFundsAmt )|| 0
        };
        return api.request('POST', '/payment/make', data);
      }
    };
  });
