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
          ScheduledPaymentDate: sp.scheduledDate,
          ScheduledPaymentAmount: sp.scheduledPaymentAmount,
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
    var validOption = function(opt) {
      return opt === PaymentOptions.TYPE_PAYOFF || opt === PaymentOptions.TYPE_PAYMENT || opt === PaymentOptions.TYPE_INTEREST;
    };

    // payment type can be 'payment' (curtailment), 'payoff', or 'interest'
    var VehicleCartItem = function(item, paymentType) {
      this.id = item.FloorplanId;
      this.vin = item.Vin;
      this.description = item.UnitDescription;
      this.stockNum = item.StockNumber;
      this.isFee = false;
      this.overrideAddress = null;

      this.paymentOption = paymentType;

      this.dueDate = item.DueDate;
      this.scheduleDate = null; // if we want to schedule a new payment

      // if the payment was previously scheduled
      this.scheduledAmount = item.ScheduledPaymentAmount;

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

      this.scheduledValues = {
        payment: null,
        payoff: null,
        interest: null
      };
    };

    VehicleCartItem.prototype = {
      getCheckoutAmount: function(option) {
        var amount,
            currentPaymentObject;

        if (validOption(option)) {
          // we will just use the passed in option
        } else if (validOption(this.paymentOption)) {
          option = this.paymentOption; // override with default
        } else {
          return undefined;
        }

        // If our payment is scheduled, grab the scheduled breakdown for that option
        if (!!this.scheduleDate) {
          currentPaymentObject = this.scheduledValues[option];
        } else { // otherwise, grab the initial object for that option
          currentPaymentObject = this[option];
        }

        amount = currentPaymentObject.principal + currentPaymentObject.fees + currentPaymentObject.interest + currentPaymentObject.cpp + (currentPaymentObject.additionalPrincipal ? currentPaymentObject.additionalPrincipal : 0);

        return amount;
      },
      getExtraPrincipal: function() {
        return this.paymentOption !== PaymentOptions.TYPE_PAYMENT ? 0 : this.payment.additionalPrincipal;
      },
      setExtraPrincipal: function(val) {
        if (!!this.scheduleDate) {
          this.scheduledValues.payment.additionalPrincipal = val;
        }
        this.payment.additionalPrincipal = val;
      },
      isPayoff: function() {
        return this.paymentOption === PaymentOptions.TYPE_PAYOFF;
      },
      updateAmountsOnDate: function(amts, date) {
        this.scheduleDate = date;

        this.scheduledValues.payoff = {
          principal: this.payoff.principal,
          fees: amts.FeeAmount,
          interest: amts.InterestAmount,
          cpp: amts.CollateralProtectionAmount
        };
        this.scheduledValues.payment = {
          principal: this.payment.principal,
          fees: amts.FeeAmount,
          interest: amts.InterestAmount,
          cpp: amts.CollateralProtectionAmount,
          additionalPrincipal: this.payment.additionalPrincipal
        };
        this.scheduledValues.interest = {
          principal: 0,
          fees: 0,
          interest: amts.InterestAmount,
          cpp: amts.CollateralProtectionAmount
        };
      },
      getApiRequestObject: function() {
        return {
          FloorplanId: this.id,
          ScheduledPaymentDate: api.toShortISODate(this.scheduleDate) || null,
          IsPayoff: this.paymentOption === PaymentOptions.TYPE_PAYOFF,
          IsInterestOnly: this.paymentOption === PaymentOptions.TYPE_INTEREST,
          AdditionalPrincipalAmount: this.paymentOption === PaymentOptions.TYPE_PAYMENT ? this.payment.additionalPrincipal : 0,
          QuotedInterestAmount: this.paymentOption === PaymentOptions.TYPE_INTEREST ? this.interest.amount : 0
        };
      },
      getBreakdown: function(option) {
        var currentObject;

        if (!validOption(option)) {
          option = this.paymentOption;
        }

        // If payment is scheduled, used the scheduled object for that option.
        currentObject = !!this.scheduleDate ? this.scheduledValues[option] : this[option];

        return currentObject;
      }
    };

    return VehicleCartItem;
  });
