'use strict';

var bambooCommitHash = process.env.bamboo_buildNumber;
var objHash = browser.element(by.css('[style=\'word-wrap: break-word; white-space: pre-wrap;\']'));

describe('\n Login Page - Language', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Build Version  - Validating the current build version has been deployed", function () {
    browser.get('https://test.nextgearcapital.com/test/version.txt');
    console.log('\n The commit has from bamboo enviornment variable "bamboo_buildNumber" is: ' + bambooCommitHash);
    objHash.getText().then(function (string) {
      var substr = string.substring(12, 19)
      expect(substr).toEqual(bambooCommitHash);
    });
  });
});


