'use strict';

describe('Model: Settings', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend, $q, settings, answersStub;

  beforeEach(inject(function ($httpBackend, _$q_, Settings) {
    httpBackend = $httpBackend;
    $q = _$q_;
    settings = Settings;
    answersStub = [
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

    httpBackend.whenPOST('/UserAccount/usersettings').respond({
      Success: true,
      Message: null,
      Data: null
    });
  }));

  describe('saveSecurityAnswers method', function() {

    it('should make the expected POST request', function () {
      httpBackend.expectPOST('/UserAccount/usersettings');
      settings.saveSecurityAnswers(answersStub);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise', function () {
      var res = null;

      settings.saveSecurityAnswers(answersStub).then(function (result) {
        res = result;
      })
      httpBackend.flush();
      expect(res).toBeDefined();
    });

  });

});