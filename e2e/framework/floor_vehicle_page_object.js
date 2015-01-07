/**
 * Created by gayathrimadala on 1/6/15.
 */

'use strict';

var FlooringVehicleObject = function() {

  this.floorVehicleurl = '#/floorcar';

  this.vinSearchField = browser.element(by.model('data.UnitVin'));
  this.colorSelection = browser.element(by.model('data.UnitColorId'));
  this.mileageField = browser.element(by.model('data.UnitMileage'));
  this.titleLocationSelection = browser.element(by.model('data.TitleLocationId'));
  this.inventoryLocation = browser.element(by.model('data.PhysicalInventoryAddressId'));

  //Sales Information
  this.tradeIn = browser.element(by.id('yes'));
  this.seller = browser.element(by.id('inputBiz'));
  this.purchaseAmount = browser.element(by.model('data.UnitPurchasePrice'));
  this.purchaseDate = browser.element(by.model('data.UnitPurchaseDate'));
  this.lineOfCredit = browser.element(by.id('inputCreditLine'));
  this.sendPayment = browser.element(by.id('inputSendPay'));
  this.bankAccount = browser.element(by.id('data.BankAccountId'));


  this.cancel = browser.element(by.cssContainingText('button', 'Cancel'));
  this.floorVehicle = browser.element(by.cssContainingText('button', 'Floor Vehicle'));


  this.buyerQueryField = browser.element(by.model('query'));
  this.inventoryLocationSelection = browser.element(by.model('data.PhysicalInventoryAddressId'));
  this.unitPurchasePriceField = browser.element(by.model('data.UnitPurchasePrice'));
  this.unitPurchaseDateField = browser.element(by.model('data.UnitPurchaseDate'));
  this.bankAccountSelection = browser.element(by.model('data.BankAccountId'));

  this.saleDescription = browser.element(by.css('.scale-description'));

  this.tooltipButton = this.saleDescription.element(by.css('button'));

  this.tooltip = browser.element(by.css('.tooltip'));

  this.colorOptions = browser.element.all(by.options('color.ColorName for color in options.colors'));
  this.locationOptions = browser.element.all(by.options('location.Name for location in options.titleLocationOptions'));
  this.inventoryLocSelect = browser.element(by.id('inputInvLoc'));
  this.inventoryLocationOptions = this.inventoryLocSelect.all(by.css('option'));
  this.lineOfCreditOptions = browser.element.all(by.options('line.LineOfCreditName for line in options.LinesOfCredit'));
  this.sendPaymentOptions = this.sendPayment.all(by.css('option'));

  this.sellerOptions = browser.element.all(by.options('location for location in sellerLocations'));
  this.bankAccountOptions = browser.element.all(by.options('account.BankAccountName for account in options.BankAccounts'));


  //Acknowledge
  this.vinAckLookupFailure = browser.element(by.model('data.VinAckLookupFailure'));
  this.inputMake = browser.element(by.id('inputMake'));
  this.inputModel = browser.element(by.id('inputModel'));
  this.inputYear = browser.element(by.id('inputYear'));
  this.inputStyle = browser.element(by.id('inputStyle'));

  this.outputMake = browser.element(by.id('outputMake'));
  this.outputModel = browser.element(by.id('outputModel'));
  this.outputYear = browser.element(by.id('outputYear'));
  this.outputStyle = browser.element(by.id('outputStyle'));

  this.styledInputs = browser.element.all(by.css('.styled-input'));

  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = this.modal.element(by.css('.modal-header'));
  this.closeModal = this.modal.element(by.cssContainingText('button', 'Close Window'));

  this.openPage = function() {
    browser.get(this.floorVehicleurl);
  };

  this.waitForPage = function() {
    var vinSearch = this.vinSearchField;
    browser.driver.wait(function() {
      return vinSearch.isDisplayed();
    }, 3000);
  };

  this.waitAndCloseModal = function() {
    waitAndCloseModal(this.modal, this.closeModal);
  };

  var waitAndCloseModal = function(modal, closeModal) {
    browser.driver.wait(function() {
      var promise = protractor.promise.defer();
      modal.isPresent().then(function(present) {
        if (present) {
          closeModal.click();
        }
        promise.fulfill(true);
      });
      return promise;
    }, 3000);
  };

  var getSearchButton = function(styledInputs, model) {
    expect(styledInputs.count()).toEqual(2);
    var promise = protractor.promise.defer();
    styledInputs.each(function(styledInput) {
      var dealerNumber = styledInput.element(by.model(model));
      dealerNumber.isPresent().then(function(present) {
        if (present) {
          var dealerSearchButton = styledInput.element(by.css('button'));
          promise.fulfill(dealerSearchButton);
        }
      });
    });
    return promise;
  };

  this.getVinSearchButton = function() {
    return getSearchButton(this.styledInputs, 'data.UnitVin');
  };

  this.getSellerSearchButton = function() {
    return getSearchButton(this.styledInputs, 'query');
  };

  this.setVin = function(vin) {
    this.vinSearchField.sendKeys(vin);
  };

  this.getVin = function() {
    return this.vinSearchField.getAttribute('value');
  };

  this.setColor = function(colorName) {
    this.colorOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === colorName) {
          option.click();
        }
      });
    });
  };

  this.getColor = function() {
    var promise = protractor.promise.defer();
    this.colorOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.setMileage = function(mileage) {
    this.mileageField.sendKeys(mileage);
  };

  this.getMileage = function() {
    return this.mileageField.getAttribute('value');
  };

  this.setTitleLocation = function(titleLocationName) {
    this.locationOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === titleLocationName) {
          option.click();
        }
      });
    });
  };

  this.getTitleLocation = function() {
    var promise = protractor.promise.defer();
    this.locationOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.setInventoryLocation = function(inventoryLocation) {
    this.inventoryLocationOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === inventoryLocation) {
          option.click();
        }
      });
    });
  };

  this.getInventoryLocation = function() {
    var promise = protractor.promise.defer();
    this.inventoryLocationOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.setLineOfCredit = function(LOC) {
    this.lineOfCreditOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === LOC) {
          option.click();
        }
      });
    });
  };

  this.getLineOfCredit = function() {
    var promise = protractor.promise.defer();
    this.lineOfCreditOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.setSendPayment = function(sendPay) {
    this.sendPaymentOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === sendPay) {
          option.click();
        }
      });
    });
  };

  this.getSendPayment = function() {
    var promise = protractor.promise.defer();
    this.sendPaymentOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.setLotNumber = function(lotNumber) {
    this.lotNumberField.sendKeys(lotNumber);
  };

  this.getLotNumber = function() {
    return this.lotNumberField.getAttribute('value');
  };

  this.setBuyerQuery = function(buyerQuery) {
    this.buyerQueryField.sendKeys(buyerQuery);
  };

  this.getBuyerQuery = function() {
    return this.buyerQueryField.getAttribute('value');
  };

  this.setUnitPurchasePrice = function(unitPurchasePrice) {
    this.unitPurchasePriceField.sendKeys(unitPurchasePrice);
  };

  this.getUnitPurchasePrice = function() {
    return this.unitPurchasePriceField.getAttribute('value');
  };

  this.setUnitPurchaseDate = function(unitPurchaseDate) {
    var modal = this.modal;
    var closeModal = this.closeModal;
    var field = this.unitPurchaseDateField;
    field.clear().then(function() {
      waitAndCloseModal(modal, closeModal);
      field.sendKeys(unitPurchaseDate);
    });
  };

  this.getUnitPurchaseDate = function() {
    return this.unitPurchaseDateField.getAttribute('value');
  };

  this.setBankAccount = function(bankAccountName) {
    this.bankAccountOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === bankAccountName) {
          option.click();
        }
      });
    });
  };

  this.getBankAccount = function() {
    var promise = protractor.promise.defer();
    this.bankAccountOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function(text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };

  this.getOutputMake = function() {
    return this.outputMake.getAttribute('value');
  };

  this.getOutputModel = function() {
    return this.outputModel.getAttribute('value');
  };

  this.getOutputYear = function() {
    return this.outputYear.getAttribute('value');
  };

  this.getOutputStyle = function() {
    return this.outputStyle.getAttribute('value');
  };

  this.getInputMake = function(make) {
    this.inputMake.sendKeys(make);
  };

  this.getInputModel = function(model) {
    this.inputModel.sendKeys(model);
  };

  this.getInputYear = function(year) {
    this.inputYear.sendKeys(year);
  };

  this.getInputStyle = function(style) {
    this.inputStyle.sendKeys(style);
  };
};

module.exports = FlooringVehicleObject;
