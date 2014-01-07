'use strict';

describe('Model: Settings', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend, $q, settings, emailStub, securityAnswersStub;

  beforeEach(inject(function ($httpBackend, _$q_, Settings) {
    httpBackend = $httpBackend;
    $q = _$q_;
    settings = Settings;
    emailStub = 'peanutbutter@jellytime.com';
    securityAnswersStub = [
      {
        'SecurityQuestionId': 1,
        'Answer': 'The Matrix'
      },
      {
        'SecurityQuestionId': 3,
        'Answer': 'Imagínate'
      },
      {
        'SecurityQuestionId': 2,
        'Answer': 'fluffy'
      }
    ];

    httpBackend.whenPOST('/UserAccount/setupNewUser').respond({
      Success: true,
      Message: null,
      Data: null
    });
  }));

  describe('saveSecurityAnswersAndEmail method', function() {

    it('should make the expected POST request', function () {
      httpBackend.expectPOST('/UserAccount/setupNewUser');
      settings.saveSecurityAnswersAndEmail(emailStub, securityAnswersStub);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise', function () {
      var res = null;

      settings.saveSecurityAnswersAndEmail(emailStub, securityAnswersStub).then(function (result) {
        res = result;
      })
      httpBackend.flush();
      expect(res).toBeDefined();
    });

  });

});