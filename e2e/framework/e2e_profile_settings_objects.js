'use strict';

function ProfileSettings() {

  //Locators

  this.elProfileSettings = browser.element(by.css('a[href="#/profile_settings"]'));
  this.elUserProfile = browser.element(by.css('section.panel.panel-default.settings-well'));
  this.elUserName = browser.element(by.css('div.col-xs-6.zeroLeftPadding.no-right-padding')).element(by.css('div.static'));
  this.elEditSettings = browser.element(by.css('button.btn-unstyle'));

  //Doers
  this.doProfileSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elProfileSettings.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doEditSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elEditSettings.click();
    browser.sleep(browser.params.shortDelay);
  };
  //Getters
  this.getTextUsername = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elUserName.getText();
    browser.sleep(browser.params.shortDelay);
  };
}
module.exports.profileSettingsObjects = ProfileSettings;
