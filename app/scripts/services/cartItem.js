'use strict';

angular.module('nextgearWebApp')
  .service('CartItem', function(VehicleCartItem, FeeCartItem) {

    var CartItem = {
      fromPayment: function(p, paymentType) {
        return new VehicleCartItem(p, paymentType);
      },
      fromScheduledPayment: function(sp) {
        var scheduledPayment = {
          FloorplanId: sp.floorplanId,
          StockNumber: sp.stockNumber,
          Vin: sp.vin,
          UnitDescription: sp.description,
          DueDate: sp.curtailmentDueDate,
          Scheduled: true,
          ScheduledPaymentDate: sp.scheduledDate,
          CurrentPayoff: sp.payoffAmount,
          PrincipalPayoff: sp.principalPayoff,
          FeesPayoffTotal: sp.FeesPayoffTotal,
          InterestPayoffTotal: sp.InterestPayoffTotal,
          CollateralProtectionPayoffTotal: sp.CollateralProtectionPayoffTotal,
          // what about curtailment payment #s???
          // AmountDue:
          // PrincipalPayment:
          // FeesPaymentTotal: sp.FeesPayoffTotal,
          // InterestPaymentTotal: sp.InterestPayoffTotal,
          // CollateralProtectionPaymentTotal: sp.CollateralProtectionPayoffTotal
        };

        return new VehicleCartItem(scheduledPayment, 'payoff'); // has to be a payoff (?)
      },
      fromFee: function(f) {
        return new FeeCartItem(f);
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
    // payment type can be 'payment' (curtailment), 'payoff', or 'interest'
    var VehicleCartItem = function(item, paymentType) {

      this.id = item.FloorplanId;
      this.vin = item.Vin;
      this.description = item.UnitDescription;
      this.stockNum = item.StockNumber;
      this.isFee = false;

      // this.isPayoff = paymentType === 'payoff' ? true : false;
      // this.isInterestOnly = paymentType === 'interestOnly' ? true : false;
      this.paymentOption = paymentType;

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
        additionalPrincipal: item.AdditionaPrincipal || 0
      };
      this.interest = {
        amount: item.InterestPaymentTotal,
        principal: 0,
        fees: 0,
        interest: item.InterestPaymentTotal,
        cpp: 0
      };
    };

    VehicleCartItem.prototype = {
      getCheckoutAmount: function(noAdditionalPrincipal) { // if true, exclude additionalPrincipal
        var amt;

        if (this.paymentOption === 'payoff') {
          amt = this.payoff.amount;
        } else if (this.paymentOption === 'interest') {
          amt = this.interest.interest;
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
        if(this.paymentOption !== 'payment') {//this.isPayoff || this.isInterestOnly || this.payment.additionalPrincipal === 0) {
          return 0;
        } else {
          return this.payment.additionalPrincipal;
        }
      },
      getItemType: function() {
        if (this.paymentOption === 'interest') {
          return 'interest only';
        } else {
          return this.paymentOption;
        }
      },
      isPayoff: function() {
        return this.paymentOption === 'payoff';
      },
      updateAmountsOnDate: function(amts) {
        if(this.paymentOption === 'payoff') {
          this.payoff.amount = amts.PaymentAmount;
          this.payoff.principal = amts.PrincipalAmount;
          this.payoff.fees = amts.FeeAmount;
          this.payoff.interest = amts.InterestAmount;
          this.payoff.cpp = amts.CollateralProtectionAmount;
        } else if (this.paymentOption === 'interest') {
          this.interest.amount = amts.InterestAmount;
          this.interest.principal = 0;
          this.interest.fees = 0;
          this.interest.interest = amts.InterestAmount;
          this.interest.cpp = 0;
        } else { // must be a payment.
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
          IsPayoff: this.paymentOption === 'payoff',
          IsInterestOnly: this.paymentOption === 'interest',
          AdditionalPrincipalAmount: this.paymentOption === 'payment' ? this.payment.additionalPrincipal : 0
        };
      }
    };

    return VehicleCartItem;
  });
