'use strict';

var AuctionReportsObject = function () {
  this.url = '#/act/reports';

  this.documents = browser.element.all(by.repeater('doc in documents'));

  this.infoBlockText = browser.element(by.css('.info-block-text'));
  this.infoBlockIcon = browser.element(by.css('.info-block-image'));

  this.currentReport = browser.element(by.cssContainingText('.well', 'Current Reports'));

  this.historicalReport = browser.element(by.cssContainingText('.well', 'Historical Reports'));
  // the following will also validate that the disbursement date, view report button and select field are in under
  // Historical Reports section
  this.disbursementDate = this.historicalReport.element(by.model('data.disDate'));
  this.viewReportButton = this.historicalReport.element(by.cssContainingText('button', 'View Report'));
  this.subsidiariesSelection = this.historicalReport.element(by.model('selectedSubsidiary'));

  this.subsidiaries = browser.element.all(by.options('o.BusinessName for o in subsidiaries'));

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var marker = this.disbursementDate;
    browser.driver.wait(function () {
      return marker.isPresent();
    }, 3000);
  };

  this.clickDisbursementDate = function () {
    this.disbursementDate.click();
  };

  this.getDisbursementDate = function () {
    return this.disbursementDate.getAttribute('value');
  };
};

module.exports = AuctionReportsObject;
