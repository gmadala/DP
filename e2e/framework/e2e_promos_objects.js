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
    this.elPromotionsDetails = element(by.css('div.promo-container'));

    //Doers
    this.doPromos = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elPromos.click();
    };

    //Getters
    this.getTextTitle = function () {
        return this.elTitle.getText();
    };
    this.getTextPromos = function () {
        return this.elPromos.getText();
    };
    this.getTextHeader = function () {
        return this.elHeader.getText();
    };

}
module.exports.promos = Promos;
