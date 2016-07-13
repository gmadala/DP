'use strict';
/**
 * @class modal_objects
 * @author Balanithiya Krishnamoorthy
 * @description Modal Objects
 * */

function ModalObjects() {
  var delay = 500;
  var longDelay = 2000;

  //Locators
  this.elModalHeader = browser.element(by.css('.modal-header'));
  this.elModalBody = browser.element(by.css('.modal-body'));
  this.elModalOKBtn = browser.element(by.css('button[type="submit"]'));

  //Getters
  this.getTextHeader = function () {
    browser.sleep(longDelay);
    return this.elModalHeader.getText();
  };
  this.getTextBody = function () {
    return this.elModalBody.getText();
  };

  //Doers
  this.doOKBtn = function () {
    return this.elModalOKBtn.click();
    browser.sleep(longDelay);
  };

}

module.exports.modalObjects = ModalObjects;
