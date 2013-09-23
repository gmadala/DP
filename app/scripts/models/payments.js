'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api, moment, Paginate, Floorplan) {

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
          RequestAmount: amount,
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
          Criteria: criteria.query || undefined,
          DueDateStart: api.toShortISODate(criteria.startDate) || undefined,
          DueDateEnd: api.toShortISODate(criteria.endDate) || undefined,
          OrderBy: 'DueDate',
          OrderDirection: 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM
        };
        return api.request('GET', '/payment/search', params).then(
          function (results) {
            self.setAvailableUnappliedFunds(results.AvailableUnappliedFundsBalance);
            angular.forEach(results.SearchResults, function (payment) {
                Floorplan.addTitleURL(payment);
              });
            return Paginate.addPaginator(results, results.PaymentRowCount, params.PageNumber, params.PageSize);
          }
        );
      },
      fetchFees: function () {
        return api.request('GET', '/payment/getaccountfees').then(
          function (result) {
            // unwrap the array
            return result.AccountFees;
          }
        );
      },
      canPayNow: function () {
        return businessHours.resolve().then(function (hours) {
          var now = moment(),
            open = hours.StartDateTime || now,
            close = hours.EndDateTime || now;
          return (now.isAfter(open) && now.isBefore(close));
        });
      },
      addPaymentToQueue: function (floorplanId, vin, stockNum, description, amount, dueDate, asPayoff) {
        var payment = {
          floorplanId: floorplanId,
          vin: vin,
          stockNum: stockNum,
          description: description,
          amount: amount,
          dueDate: dueDate,
          isPayoff: asPayoff
        };
        paymentQueue.payments[floorplanId] = payment;
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
      setAvailableUnappliedFunds: function (amount) {
        // a bit goofy - we don't have a dedicated endpoint to fetch this @ checkout, but
        // it comes back with other data earlier in the workflow, so remember it for later use
        paymentQueue.unappliedFundsAvailable = amount;
      },
      getAvailableUnappliedFunds: function () {
        return paymentQueue.unappliedFundsAvailable;
      },
      cancelScheduled: function (payment) {
        var data = {
          FloorplanId: payment.FloorplanId
        };
        return api.request('POST', '/payment/cancelscheduledpayment', data).then(
          function (/*success*/) {
            payment.Scheduled = false;
            return payment;
          }
        );
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
      checkout: function (fees, payments, bankAccount, unappliedFundsAmt) {
        var shortFees = [],
          shortPayments = [];
        angular.forEach(payments, function (payment) {
          shortPayments.push({
            FloorplanId: payment.floorplanId,
            ScheduledSetupDate: api.toShortISODate(payment.scheduleDate) || null,
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
          UnappliedFundsAmount: unappliedFundsAmt || 0
        };
        return api.request('POST', '/payment/make', data);
      }
    };
  });
