(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('FeeCartItem', FeeCartItemFn);

  FeeCartItemFn.$inject = ['api'];

  function FeeCartItemFn(api) {

    var FeeCartItem = function(item) {
      this.isFee = true;
      this.financialRecordId = item.FinancialRecordId;
      this.vin = item.Vin;
      this.feeType = item.FeeType;
      this.description = item.Description;
      this.dueDate = item.EffectiveDate;
      this.amount = item.Balance;
      this.scheduled = item.Scheduled;
    };

    // FeeCartItem & VehicleCartItem should have the same functions for getting item type, checkout amount, request object, etc.
    FeeCartItem.prototype = {
      getCheckoutAmount: function() {
        return this.amount;
      },
      getApiRequestObject: function() {
        return {
          FinancialRecordId: this.financialRecordId,
          ScheduledPaymentDate: api.toShortISODate(this.scheduleDate) || null
        };
      }
    };

    return FeeCartItem;

  }
})();
