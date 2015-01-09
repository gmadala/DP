'use strict';

var AuctionDealerSearchObject = function () {

  this.url = '#/act/dealersearch';

  this.dealerNumberField = browser.element(by.model('numberSearch.query.dealerNumber'));
  this.accessNumberField = browser.element(by.model('numberSearch.query.auctionAccessNumber'));

  this.dealerNameField = browser.element(by.model('nameSearch.query.dealerName'));
  this.dealerCityField = browser.element(by.model('nameSearch.query.city'));
  this.dealerStateField = browser.element(by.model('nameSearch.query.state'));
  this.searchDealerButton = browser.element(by.cssContainingText('button', 'Search Dealers'));

  this.styledInputs = browser.element.all(by.css('.styled-input'));

  this.stateOptions = browser.element.all(by.options('state.StateName for state in states'));

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var dealerNumber = this.dealerNumberField;
    browser.driver.wait(function () {
      return dealerNumber.isDisplayed();
    }, 3000);
  };

  var getSearchButton = function (styledInputs, model) {
    expect(styledInputs.count()).toEqual(2);
    var promise = protractor.promise.defer();
    styledInputs.each(function (styledInput) {
      var dealerNumber = styledInput.element(by.model(model));
      dealerNumber.isPresent().then(function (present) {
        if (present) {
          var dealerSearchButton = styledInput.element(by.css('button'));
          promise.fulfill(dealerSearchButton);
        }
      });
    });
    return promise;
  };

  this.getDealerNumberSearchButton = function () {
    return getSearchButton(this.styledInputs, 'numberSearch.query.dealerNumber');
  };

  this.getAuctionAccessSearchButton = function () {
    return getSearchButton(this.styledInputs, 'numberSearch.query.auctionAccessNumber');
  };

  this.setDealerNumber = function (dealerNumber) {
    this.dealerNumberField.sendKeys(dealerNumber);
  };

  this.getDealerNumber = function () {
    return this.dealerNumberField.getAttribute('value');
  };

  this.setAccessNumber = function (accessNumber) {
    this.accessNumberField.sendKeys(accessNumber);
  };

  this.getAccessNumber = function () {
    return this.accessNumberField.getAttribute('value');
  };

  this.setDealerName = function (dealerName) {
    this.dealerNameField.sendKeys(dealerName);
  };

  this.getDealerName = function () {
    return this.dealerNameField.getAttribute('value');
  };

  this.setCity = function (city) {
    this.dealerCityField.sendKeys(city);
  };

  this.getCity = function () {
    return this.dealerCityField.getAttribute('value');
  };

  this.setState = function (stateName) {
    this.stateOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === stateName) {
          option.click();
        }
      });
    });
  };

  this.getState = function () {
    var promise = protractor.promise.defer();
    this.stateOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          option.getText().then(function (text) {
            promise.fulfill(text);
          });
        }
      });
    });
    return promise;
  };
};

module.exports = AuctionDealerSearchObject;
