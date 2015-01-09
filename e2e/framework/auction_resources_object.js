'use strict';

var AuctionResourcesObject = function() {
  this.url = '#/act/documents';

  this.infoBlockText = browser.element(by.css('.info-block-text'));
  this.infoBlockIcon = browser.element(by.css('.info-block-image'));

  this.documents = browser.element(by.cssContainingText('.well', 'NextGear Capital Documents'));

  this.openPage = function() {
    browser.get(this.url);
  };

  this.waitForPage = function() {

  };
};

module.exports = AuctionResourcesObject;
