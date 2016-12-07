'use strict';

var bambooCommitHash = process.env.bamboo_repository_revision_number.substring(0, 7);
var objHash = browser.element(by.css('[style=\'word-wrap: break-word; white-space: pre-wrap;\']'));

describe('Build Verification', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Build Version  - Validating the current build version has been deployed", function () {
    browser.get('https://test.nextgearcapital.com/test/version.txt');
    console.log('\n The commit hash from bamboo environment variable "bamboo_repository_revision_number" is: ' + bambooCommitHash);
    objHash.getText().then(function (string) {
      var substr = string.substring(12, 19)
      expect(substr).toEqual(bambooCommitHash);
    });
  });
});


