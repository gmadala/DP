'use strict';

var AuctionResourcesObject = function () {
  this.url = '#/act/documents';

  this.documents = browser.element(by.cssContainingText('.well', 'NextGear Capital Documents'));
};

module.exports = AuctionResourcesObject;
