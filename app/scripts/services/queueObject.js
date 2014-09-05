'use strict';

angular.module('nextgearWebApp')
  .value('queueObject', function(item, isFee, isPayoff) {
    var queueObj = {
      vin: item.Vin,
      isFee: isFee,
      isPayoff: isPayoff ? true : false, // if isPayoff is false or undefined, it's not a payoff.
      scheduled: item.Scheduled
    };

    if (isFee) {
      // handle fee-specific properties here
      queueObj.financialRecordId = item.FinancialRecordId;
      queueObj.feeType = item.FeeType;
      queueObj.description = item.Description;
      queueObj.amount = item.Balance;
      queueObj.dueDate = item.EffectiveDate;

      if (item.Scheduled) {
        queueObj.scheduleDate = item.ScheduledDate;
      }
    } else {
      // we have a payment; handle that logic here
      queueObj.id = item.FloorplanId;
      queueObj.stockNum = item.StockNumber;
      queueObj.description = item.UnitDescription;
      queueObj.overrideAddress = null;
      queueObj.dueDate = item.DueDate;

      if (isPayoff) {
        queueObj.amount = item.CurrentPayoff,
        queueObj.principal = item.PrincipalPayoff,
        queueObj.fees = item.FeesPayoffTotal,
        queueObj.interest = item.InterestPayoffTotal,
        queueObj.collateralProtection = item.CollateralProtectionPayoffTotal;
      } else {
        queueObj.amount = item.AmountDue,
        queueObj.principal = item.PrincipalDue,
        queueObj.fees = item.FeesPaymentTotal,
        queueObj.interest = item.InterestPaymentTotal,
        queueObj.collateralProtection = item.CollateralProtectionPaymentTotal;
      }

      if (item.Scheduled) {
        queueObj.scheduleDate = item.ScheduledPaymentDate;
      }
    }

    return queueObj;
  });
