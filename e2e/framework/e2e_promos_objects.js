'use strict';

/**
 * @class promos_objects
 * @author Balanithiya Krishnamoorthy
 * @description Promos Page Objects
 * */

function Promos() {

  //Locators
  this.elImage = element(by.css('div.info-block-image'));
  this.elTitle = element(by.css('h6.info-block-text'));
  this.elHeader = element(by.css('h2.well-title'));
  this.elPromos = element(by.id('showorhide'));
  this.elPromotionsDetails = element(by.css('div.promo-item.inactive.row.empty-promos'));

  //Doers
  this.doPromos = function () {
    return this.elPromos.click();
    browser.sleep(browser.params.shortDelay);
  };

  //Getters
  this.getTextTitle = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elTitle.getText();
  };
  this.getTextPromos = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elPromos.getText();
  };
  this.getTextHeader = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elHeader.getText();
  }

}
module.exports.promos = Promos;
