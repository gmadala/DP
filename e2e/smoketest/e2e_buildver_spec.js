'use strict';

//var bambooCommitHash = process.env.bamboo_repository_revision_number.substring(0, 7);

var bambooCommitHash = process.env.bamboo.planRepository.revision.substring(0, 7);

console.log("The value for bamboo_repository_revision_number is " + process.env.bamboo.planRepository.revision);

var objHash = browser.element(by.css('[style=\'word-wrap: break-word; white-space: pre-wrap;\']'));
var appendurl = "version.txt";

describe('Build Verification', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Build Version  - Validating the current build version has been deployed", function () {

    browser.get(browser.baseUrl.split('#')[0] + appendurl);

    console.log('\n The commit hash from bamboo environment variable "bamboo_repository_revision_number" is: ' + bambooCommitHash);

    browser.getCurrentUrl().then(function (url) {
          console.log("\n The url being used is " + url)
      });

    objHash.getText().then(function (string) {
      var substr = string.substring(12, 19);
      expect(substr).toEqual(bambooCommitHash);
    });
  });
});
