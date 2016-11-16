'use strict';
/**
 * @class modal_objects
 * @author Balanithiya Krishnamoorthy
 * @description Modal Objects
 * */

function ModalObjects() {

    //Locators
    this.elModalHeader = browser.element(by.css('.modal-header'));
    this.elModalBody = browser.element(by.css('.modal-body'));
    this.elModalOKBtn = browser.element(by.css('button[type="submit"]'));

    //Getters
    this.getTextHeader = function () {
        browser.sleep(browser.params.longDelay);
        return this.elModalHeader.getText();
    };
    this.getTextBody = function () {
        return this.elModalBody.getText();
    };

    //Doers
    this.doOKBtn = function () {
        this.elModalOKBtn.click();
        browser.sleep(browser.params.longerDelay);
    };

}

module.exports.modalObjects = ModalObjects;
