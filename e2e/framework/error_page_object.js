'use strict';

var ErrorObject = function () {
};

ErrorObject.prototype = Object.create({}, {

  lineOfCreditError: {
    get: function () {
      return ($('[ng-show="formValidation.lineOfCredit.$error.required"]').isDisplayed());
    }
  },
  tempOrPermanent: {
    get: function () {
      return ($('[ng-show="formValidation.isTemporary.$error.required"]').isDisplayed());
    }
  },
  increaseAmount: {
    get: function () {
      return ($('[ng-show="formValidation.increaseAmt.$error.required"]').isDisplayed());
    }
  },
  payOutAmountError: {
    get: function () {
      return ($('[ ng-show="validity.payoutAmt.$error.required"]').isDisplayed());
    }
  }
});

module.exports = ErrorObject;
