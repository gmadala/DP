'use strict';

function ProfileSettings() {

  //Locators

  this.elProfileSettings = browser.element(by.css('a[href="#/profile_settings"]'));

  //Doers
  this.doProfileSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elProfileSettings.click();
    browser.sleep(browser.params.shortDelay);
  };

}
module.exports.profileSettingsObjects = ProfileSettings;
