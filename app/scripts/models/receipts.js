'use strict';

angular.module('nextgearWebApp')
  .factory('Receipts', function receipts($q, api) {
    return {
      search: function() {
        return api.request('GET', '/receipt/search');
        // $scope.receipts = [{
        //   vin: 'CH224157',
        //   vehicle: '2008 Toyota Sequoia Limited Tan',
        //   stockNo: '1064',
        //   status: 'Processed',
        //   payDate: '5/10/2013',
        //   applied: 20864.24,
        //   provided: 3181.60,
        //   receiptNo: 2146838,
        //   payment: 'ACH',
        //   checkNo: '',
        //   payee: ''
        // }];
      }
    };
  });
