'use strict';

var AuctionDashboardObject = function() {

  this.url = '#/act/home';

  this.previousDisbursementsLink = browser.element(by.cssContainingText('button', 'Previous Disbursements'));

  this.openPage = function() {
    browser.get(this.url);
  };

  this.waitForPage = function() {
    var previousDisbursementsLink = this.previousDisbursementsLink;
    browser.driver.wait(function() {
      return previousDisbursementsLink.isDisplayed();
    }, 3000);
  };

};

module.exports = AuctionDashboardObject;
