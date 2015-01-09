/**
 * Created by gayathrimadala on 1/5/15.
 */

'use strict';

var AccountManagementPageObject = function () {
};

AccountManagementPageObject.prototype = Object.create({}, {


  // Locators
  accountMgtUrl: {
    value: '#/account_management'
  },

  requestCreditIncrease: {
    get: function () {
      return browser.element(by.cssContainingText('a', 'Request a Credit Increase'));
    }
  },

  creditExtend: {
    get: function () {
      return browser.element(by.cssContainingText('li', 'Approved')).element(by.css('input'));
    }
  },

  isNotTemporary: {
    get: function () {
      return browser.element(by.id('isTemp'));
    }
  },

  selectAmount: {
    get: function () {
      return browser.element(by.model('selector.amount'));
    }
  },

  GOFinancial: {
    get: function () {
      return browser.element(by.cssContainingText('a', 'Login to GO Financial'));
    }
  },

  cancelRequest: {
    get: function () {
      return browser.element(by.cssContainingText('button', 'Cancel Request'));
    }
  },

  confirmRequest: {
    get: function () {
      return browser.element(by.cssContainingText('button', 'Confirm Request'));
    }
  },

  //Setters
  setSelectAmount: {
    value: function () {
      this.selectAmount.sendKeys('100');
      browser.waitForAngular();
    }
  },

  //Doers
  doSelectAmount: {
    value: function () {
      this.setSelectAmount();
      browser.waitForAngular();
    }
  },

  goTorequestCreditIncrease: {
    value: function () {
      this.requestCreditIncrease.click();
      browser.waitForAngular();
    }
  },

  goToGOFinancial: {
    value: function () {
      this.GOFinancial.click();
      browser.waitForAngular();
    }
  },

  goToCreditExtend: {
    value: function () {
      browser.driver.actions().click(this.creditExtend).perform();
      browser.waitForAngular();
    }
  },

  goToIsNotTemporary: {
    value: function () {
      browser.driver.actions().click(this.isNotTemporary).perform();
    }
  },

  goToCancelRequest: {
    value: function () {
      this.cancelRequest.click();
      browser.waitForAngular();
    }
  },

  goToConfirmRequest: {
    value: function () {
      this.confirmRequest.click();
      browser.waitForAngular();
    }
  },

  //Account Management Content WMT-87
  //Locators
  businessForm: {
    get: function () {
      return browser.element(by.css('[name=busSettings]'));
    }
  },
  businessEmailText: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Business Email'));
    }
  },
  businessEmail: {
    get: function () {
      return this.businessForm.all(by.css('static'));  //browser.element(by.model('business.data.email'));
    }
  },
  registrationEnabled: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'No'));
    }
  },
  editSettings: {
    get: function () {
      var section = browser.element(by.cssContainingText('section', 'Business Settings'));
      return section.element(by.cssContainingText('button', 'Edit Settings'));
    }
  },
  businessEmailInput: {
    get: function () {
      return browser.element(by.model('business.dirtyData.email'));
    }
  },
  enhancedNo: {
    get: function () {
      return browser.element(by.id('enhancedNo'));
    }
  },
  enhancedYes: {
    get: function () {
      return browser.element(by.id('enhancedYes'));    //browser.element(by.cssContainingText('span','Yes'));
    }
  },
  registrationEnabledText: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Enhanced Registration Enabled?'));
    }
  },
  paragraphOne: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Enhanced Registration will result in all account access being restricted to users with a PIN. All guarantors will be asked to set up their PIN when logging in to MyNextGear.'));
    }
  },
  paragraphTwo: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Create your Enhanced Registration four digit PIN.'));
    }
  },
  enhancedRegistrationPIN: {
    get: function () {
      return browser.element(by.model('business.dirtyData.enhancedRegistrationPin'));
    }
  },
  enhancedRegPINError: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Your PIN must consist of four numbers, no letters or special characters.'));
    }
  },
  saveSettings: {
    get: function () {
      var section = browser.element(by.cssContainingText('section', 'Business Settings'));
      return section.element(by.cssContainingText('span', 'Save Settings'));
    }
  },

  //Setters
  setEnhancedRegistrationPIN: {
    value: function (pinValue) {
      this.enhancedRegistrationPIN.sendKeys(pinValue);
      browser.waitForAngular();
    }
  },

  //Doers
  doEnhancedRegistrationPIN: {
    value: function (pinValue) {
      this.setEnhancedRegistrationPIN(pinValue);
      browser.waitForAngular();
    }
  },

  //Financial Accounts
  financialSettingsForm: {
    get: function () {
      return browser.element(by.css('[name=financialSettings]'));
    }
  },


  bankAccountText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Bank Account(s)'));
    }
  },
  availableCreditText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Available Credit'));
    }
  },
  ReserveFundsText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Reserve Funds'));
    }
  },
  lastPaymentText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Last Payment'));
    }
  },
  lastPaymentDateText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Last Payment Date'));
    }
  },
  unappliedFundsText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Unapplied Funds'));
    }
  },
  totalAvailableText: {
    get: function () {
      return this.financialSettingsForm.all(by.cssContainingText('span', 'Total Available'));
    }
  },

  bankAccounts: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('acct.BankAccountName'));
    }
  },

  availableCredit: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.availableCredit'));
    }
  },
  reserveFunds: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.reserveFunds'));
    }
  },
  lastPayment: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.lastPayment.amount'));
    }
  },
  lastPaymentDate: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.lastPayment.date'));
    }
  },
  unappliedFunds: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.unappliedFunds'));
    }
  },
  totalAvailable: {
    get: function () {
      return this.financialSettingsForm.all(by.exactBinding('financial.data.totalAvailable'));
    }
  },

  //Title Settings
  titleForm: {
    get: function () {
      return browser.element(by.css('form[name="titleSettings"]'));
    }
  },
  defaultAddressText: {
    get: function () {
      return this.titleForm.all(by.cssContainingText('span', 'Default Address'));
    }
  },
  buttonHelp: {
    get: function () {
      return this.titleForm.all(by.css('.btn-help-adjust'));
    }
  },
  additionalAddressText: {
    get: function () {
      return this.titleForm.all(by.cssContainingText('span', 'Additional Addresses'));
    }
  },
  defaultAddress: {
    get: function () {
      return browser.element(by.model('title.dirtyData.titleAddress'));
    }
  },
  defaultAddressOptions: {
    get: function () {
      return this.defaultAddress.all(by.css('option'));
    }
  },
  additionalAddress: {
    get: function () {
      return this.titleForm.all(by.exactBinding('title.data.extraAddresses'));
    }
  },
  editTitleSettings: {
    get: function () {
      var section = browser.element(by.cssContainingText('section', 'Title Settings'));
      return section.element(by.cssContainingText('button', 'Edit Settings'));
    }
  },
  saveTitleSettings: {
    get: function () {
      var section = browser.element(by.cssContainingText('section', 'Title Settings'));
      return section.element(by.cssContainingText('button', 'Save Settings'));
    }
  },
  cancelTitleSettings: {
    get: function () {
      var section = browser.element(by.cssContainingText('section', 'Title Settings'));
      return section.element(by.cssContainingText('button', 'Cancel'));
    }
  },
  editDefaultAddress: {
    get: function () {
      return this.titleForm.all(by.model('title.dirtyData.titleAddress'));
    }
  },
  addressOne: {
    get: function () {
      return this.titleForm.all(by.exactBinding('address.Line1'));
    }
  },
  addressTwo: {
    get: function () {
      return this.titleForm.all(by.exactBinding('address.Line2'));
    }
  },
  addressCity: {
    get: function () {
      return this.titleForm.all(by.exactBinding('address.City'));
    }
  },
  addressState: {
    get: function () {
      return this.titleForm.all(by.exactBinding('address.State'));
    }
  },
  addressZip: {
    get: function () {
      return this.titleForm.all(by.exactBinding('address.Zip'));
    }
  },

  setAddressLocation: {
    value: function (addressLocationName) {
      this.defaultAddress.element(by.cssContainingText('option', addressLocationName)).click();
    }
  },

  getAddressLocation: {
    value: function () {
      var promise = protractor.promise.defer();
      this.defaultAddressOptions.each(function (option) {
        option.isSelected().then(function (selected) {
          if (selected) {
            option.getText().then(function (text) {
              promise.fulfill(text);
            });
          }
        });
      });
      return promise;
    }
  },

  goToEditSettings: {
    value: function () {
      this.editSettings.click();
      browser.waitForAngular();
    }
  },
  goToEnhancedYes: {
    value: function () {
      browser.driver.actions().click(this.enhancedYes).perform();
      browser.waitForAngular();
    }
  },

  goSaveSettings: {
    value: function () {
      this.saveSettings.click();
      browser.waitForAngular();
    }
  },

  goToEditTitleSettings: {
    value: function () {
      this.editTitleSettings.click();
      browser.waitForAngular();
    }
  },
  goToSaveTitleSettings: {
    value: function () {
      this.saveTitleSettings.click();
      browser.waitForAngular();
    }
  },
  goToCancelTitleSettings: {
    value: function () {
      this.cancelTitleSettings.click();
      browser.waitForAngular();
    }
  },
  goToButtonHelp: {
    value: function () {
      this.buttonHelp.click();
      browser.waitForAngular();
    }
  }

});
module.exports = AccountManagementPageObject;
