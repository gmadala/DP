'use strict';

var AuctionNavigationObject = function() {
  this.navLinks = browser.element.all(by.css('.navLink'));

  this.getNavLink = function(navTitle) {
    var promise = protractor.promise.defer();
    this.navLinks.each(function(navLink) {
      navLink.getText().then(function(text) {
        if (text.toLowerCase() === navTitle.toLowerCase()) {
          promise.fulfill(navLink);
        }
      });
    });
    return promise;
  };
};

module.exports = AuctionNavigationObject;
