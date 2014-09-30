'use strict';

angular.module('nextgearWebApp')
  .service('CartItem', function(VehicleCartItem, FeeCartItem, PaymentOptions) {

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
          AmountDue: sp.PrincipalDue + sp.FeesPayoffTotal + sp.InterestPayoffTotal + sp.CollateralProtectionPayoffTotal,
          PrincipalDue: sp.PrincipalDue,
          FeesPaymentTotal: sp.FeesPayoffTotal,
          InterestPaymentTotal: sp.InterestPayoffTotal,
          CollateralProtectionPaymentTotal: sp.CollateralProtectionPayoffTotal
        };
        // Has to be a payoff initially, because when we add a payment
        // from the scheduled payments page it is via the "Payoff Now" button.
        return new VehicleCartItem(scheduledPayment, PaymentOptions.TYPE_PAYOFF);
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
  .factory('VehicleCartItem', function(api, PaymentOptions) {
    // payment type can be 'payment' (curtailment), 'payoff', or 'interest'
    var VehicleCartItem = function(item, paymentType) {

      this.id = item.FloorplanId;
      this.vin = item.Vin;
      this.description = item.UnitDescription;
      this.stockNum = item.StockNumber;
      this.isFee = false;

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

        if (this.paymentOption === PaymentOptions.TYPE_PAYOFF) {
          amt = this.payoff.amount;
        } else if (this.paymentOption === PaymentOptions.TYPE_INTEREST) {
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
        if(this.paymentOption !== PaymentOptions.TYPE_PAYMENT) {//this.isPayoff || this.isInterestOnly || this.payment.additionalPrincipal === 0) {
          return 0;
        } else {
          return this.payment.additionalPrincipal;
        }
      },
      isPayoff: function() {
        return this.paymentOption === PaymentOptions.TYPE_PAYOFF;
      },
      updateAmountsOnDate: function(amts) {
        if(this.paymentOption === PaymentOptions.TYPE_PAYOFF) {
          this.payoff.amount = amts.PaymentAmount;
          this.payoff.principal = amts.PrincipalAmount;
          this.payoff.fees = amts.FeeAmount;
          this.payoff.interest = amts.InterestAmount;
          this.payoff.cpp = amts.CollateralProtectionAmount;
        } else if (this.paymentOption === PaymentOptions.TYPE_INTEREST) {
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
          IsPayoff: this.paymentOption === PaymentOptions.TYPE_PAYOFF,
          IsInterestOnly: this.paymentOption === PaymentOptions.TYPE_INTEREST,
          AdditionalPrincipalAmount: this.paymentOption === PaymentOptions.TYPE_PAYMENT ? this.payment.additionalPrincipal : 0
        };
      },
      getBreakdown: function() {
        var breakdown;

        switch(this.paymentOption) {
        case PaymentOptions.TYPE_PAYMENT:
          breakdown = this.payment;
          break;
        case PaymentOptions.TYPE_PAYOFF:
          breakdown = this.payoff;
          break;
        case PaymentOptions.TYPE_INTEREST:
          breakdown = this.interest;
          break;
        default:
          breakdown = '_unable to get breakdown_';
        }

        return breakdown;
      }
    };

    return VehicleCartItem;
  });
