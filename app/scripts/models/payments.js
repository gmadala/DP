'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api, moment, CartItem, Paginate, Floorplan, segmentio, metric) {

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

    // provides caching so that we only have to request possible payment date data once per day.
    var possiblePaymentDates = {
      data: null,
      cacheDate: null,
      promise: function(startDate, endDate) {
        if(!possiblePaymentDates.cacheDate || !moment().isSame(possiblePaymentDates.cacheDate, 'day')) {
          // we dont have possible payment dates cached for the current date; fetch them now
          return api.request('GET', '/payment/possiblePaymentDates/' + startDate + '/' + endDate).then(
            function(result) {
              possiblePaymentDates.data = result;
              possiblePaymentDates.cacheDate = moment();

              return result;
            }
          );
        } else {
          return $q.when(possiblePaymentDates.data);
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

    var paymentInProgress = false;

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
          OrderBy: criteria.sortField || 'DueDate',
          OrderByDirection: criteria.sortDesc ? 'DESC' : 'ASC',
          PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
          PageSize: Paginate.PAGE_SIZE_MEDIUM,
          PhysicalInventoryAddressIds: criteria.inventoryLocation && criteria.inventoryLocation.BusinessAddressId
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
      addPaymentToQueue: function (payment, asPayoff) {
        // incoming object will have a FloorplanId; the new CartItem will just have id.
        var p = new CartItem(payment, false/* isFee */, asPayoff);

        paymentQueue.payments[p.id] = p;
        segmentio.track(metric.ADD_TO_BASKET);
      },
      addFeeToQueue: function (fee) {
        var f = new CartItem(fee, true/* isFee */);
        paymentQueue.fees[f.financialRecordId] = f;
        segmentio.track(metric.ADD_TO_BASKET);
      },
      removePaymentFromQueue: function (id) {
        delete paymentQueue.payments[id];
      },
      removeFeeFromQueue: function (id) {
        delete paymentQueue.fees[id];
      },
      removeFromQueue: function (item) {

        if(item.isFee) {
          this.removeFeeFromQueue(item.financialRecordId);
        } else {
          this.removePaymentFromQueue(item.id);
        }
      },
      isPaymentOnQueue: function (id) {
        var queueItem = paymentQueue.payments[id];

        if (!queueItem) {
          return false; // not in queue
        }
        else {
          // payment is on queue, return whether it is a payoff or payment
          return (queueItem.isPayoff ? 'payoff' : 'payment'); // in this case, 'payment' = 'curtailment'
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
      cancelScheduledFee: function (webScheduledAccountFeeId) {
        return api.request('POST', '/payment/cancelscheduledaccountfeepayment/' + webScheduledAccountFeeId);
      },
      fetchPossiblePaymentDates: function (startDate, endDate, asMap) {
        startDate = api.toShortISODate(startDate);
        endDate = api.toShortISODate(endDate);
        return possiblePaymentDates.promise(startDate, endDate).then(
          function(result) {
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
      updatePaymentAmountOnDate: function (payment, scheduledDate, isPayoff) {
        var params = {
          FloorplanId: payment.id,
          ScheduledDate: api.toShortISODate(scheduledDate),
          IsCurtailment: !isPayoff
        };
        return api.request('GET', '/payment/calculatepaymentamount', params).then(function(result) {
          payment.updateAmountsOnDate(result);
          return result;
        });
      },
      checkout: function (fees, payments, bankAccount, unappliedFundsAmt) {
        var shortFees = [],
          shortPayments = [];

        angular.forEach(payments, function (payment) {
          shortPayments.push(payment.getApiRequestObject());
        });
        angular.forEach(fees, function (fee) {
          shortFees.push(fee.getApiRequestObject());
        });

        var data = {
          SelectedFloorplans: shortPayments,
          AccountFees: shortFees,
          BankAccountId: bankAccount.BankAccountId,
          UnappliedFundsAmount: api.toFloat(unappliedFundsAmt )|| 0
        };
        paymentInProgress = true;
        return api.request('POST', '/payment/2_0/make', data).then(function(response) {
          paymentInProgress = false;
          return response;
        }, function(error) {
          paymentInProgress = false;
          // Rethrow error. Doing it this way propagates the rejection
          // Without an exception being throw at the end of the promise chain
          return $q.reject(error);
        });
      },
      paymentInProgress: function() {
        return paymentInProgress || Floorplan.overrideInProgress();
      },
      requestExtension: function (floorplanId) {
        return api.request('POST', '/Floorplan/requestextension/' + floorplanId);
      }
    };
  });
