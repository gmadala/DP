'use strict';

angular.module('nextgearWebApp')
  .factory('CartItem', function(VehicleCartItem, FeeCartItem) {

    var CartItem = function(item, isFee, isPayoff) {
      if (isFee) {
        return new FeeCartItem(item);
      } else {
        return new VehicleCartItem(item, isPayoff);
      }
    };

    return CartItem;
  })
  .factory('FeeCartItem', function(api) {

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
      getItemType: function() {
        return 'fee';
      },
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
  })
  .factory('VehicleCartItem', function(api) {
    var VehicleCartItem = function(item, isPayoff) {
      this.id = item.FloorplanId;
      this.vin = item.Vin;
      this.description = item.UnitDescription;
      this.stockNum = item.StockNumber;
      this.isFee = false;
      this.isPayoff = isPayoff ? true : false; // if isPayoff is false or undefined, it's not a payoff

      this.dueDate = item.DueDate;
      this.scheduled = item.Scheduled;
      this.overrideAddress = null;

      this.payoff = {
        amount: item.CurrentPayoff,
        principal: item.PrincipalPayoff,
        fees: item.FeesPayoffTotal,
        interest: item.InterestPayoffTotal,
        cpp: item.CollateralProtectionPayoffTotal
      };
      this.payment = {
        amount: item.AmountDue,
        principal: item.PrincipalDue,
        fees: item.FeesPaymentTotal,
        interest: item.InterestPaymentTotal,
        cpp: item.CollateralProtectionPaymentTotal,
        additionalPrincipal: 0
      };
    };

    VehicleCartItem.prototype = {
      getCheckoutAmount: function(noAdditionalPrincipal) { // if true, exclude additionalPrincipal
        var amt;

        if (this.isPayoff) {
          amt = this.payoff.amount;
        } else {
          if (noAdditionalPrincipal) {
            amt = this.payment.amount;
          } else {
            amt = this.payment.amount + this.payment.additionalPrincipal;
          }
        }

        return amt;
      },
      getExtraPrincipal: function() {
        if(this.isPayoff || this.payment.additionalPrincipal === 0) {
          return 0;
        } else {
          return this.payment.additionalPrincipal;
        }
      },
      getItemType: function() {
        if (this.isPayoff) {
          return 'payoff';
        } else {
          return 'payment';
        }
      },
      updateAmountsOnDate: function(amts) {
        if(this.isPayoff) {
          this.payoff.amount = amts.PaymentAmount;
          this.payoff.principal = amts.PrincipalAmount;
          this.payoff.fees = amts.FeeAmount;
          this.payoff.interest = amts.InterestAmount;
          this.payoff.cpp = amts.CollateralProtectionAmount;
        } else {
          this.payment.amount = amts.PaymentAmount;
          this.payment.principal = amts.PrincipalAmount;
          this.payment.fees = amts.FeeAmount;
          this.payment.interest = amts.InterestAmount;
          this.payment.cpp = amts.CollateralProtectionAmount;
        }
      },
      getApiRequestObject: function() {
        return {
          FloorplanId: this.id,
          ScheduledPaymentDate: api.toShortISODate(this.scheduleDate) || null,
          IsPayoff: this.isPayoff,
          AdditionalPrincipalAmount: !this.isPayoff ? this.payment.additionalPrincipal : 0
        };
      }
    };

    return VehicleCartItem;
  });
