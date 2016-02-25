'use strict';

angular.module('nextgearWebApp')
  .value('PaymentOptions', {
    TYPE_PAYMENT: 'payment',
    TYPE_PAYOFF: 'payoff',
    TYPE_INTEREST: 'interest'
  });