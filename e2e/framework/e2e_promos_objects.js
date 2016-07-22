'use strict';

/**
 * @class promos_objects
 * @author Balanithiya Krishnamoorthy
 * @description Promos Page Objects
 * */

function Promos() {

  //Locators
  this.elIimage = element(by.css('div.info-block-image'));
  this.elTitle = element(by.css('h6.info-block-text'));
  this.elHeader = element(by.css('h2.well-title'));
  this.elShowOldPromos = element(by.id('showorhide'));
  this.elPromotionsDetails = element(by.css('div.promo-item.inactive.row.empty-promos'));

  //Doers
  this.doShowOldPromos = function () {
    return this.elShowOldPromos.click();
    browser.sleep(browser.params.delay);
  };

  //Getters
  this.getTextTitle = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elTitle.getText();
  };
  this.getTextShowPromos = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elShowOldPromos.getText();
  };
  this.getTextHeader = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elHeader.getText();
  }

}
module.exports.promos = Promos;
