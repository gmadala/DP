'use strict';

var AuctionDealerSearchObject = function() {

  this.url = '#/act/dealersearch';

  this.dealerNumberField = browser.element(by.model('numberSearch.query.dealerNumber'));
  this.accessNumberField = browser.element(by.model('numberSearch.query.auctionAccessNumber'));

  this.dealerNameField = browser.element(by.model('nameSearch.query.dealerName'));
  this.dealerCityField = browser.element(by.model('nameSearch.query.city'));
  this.dealerStateField = browser.element(by.model('nameSearch.query.state'));
  this.searchDealerButton = browser.element(by.cssContainingText('button', 'Search Dealers'));

  this.styledInputs = browser.element.all(by.css('.styled-input'));

  this.openPage = function() {
    browser.get(this.url);
  };

  this.waitForPage = function() {
    var dealerNumber = this.dealerNumberField;
    browser.driver.wait(function() {
      return dealerNumber.isDisplayed();
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

  this.getDealerNumberSearchButton = function() {
    return getSearchButton(this.styledInputs, 'numberSearch.query.dealerNumber');
  };

  this.getAuctionAccessSearchButton = function() {
    return getSearchButton(this.styledInputs, 'numberSearch.query.auctionAccessNumber');
  };
};

module.exports = AuctionDealerSearchObject;
