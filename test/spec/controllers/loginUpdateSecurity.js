'use strict';

describe('Controllers: LoginUpdateSecurityCtrl', function() {

  beforeEach(module('nextgearWebApp'));

  var settingsData, ProfileSettingsMock, scope, LoginUpdateSecurityCtrl, userData, UserMock, locationMock, $httpBackend;

  function noop() {
  }

  beforeEach(inject(function($rootScope, $controller,_$httpBackend_) {

    settingsData = {
      Username: '10264DG',
      SecurityQuestions: [
        {
          "SecurityQuestionId": 1,
          "Answer": "The Matrix"
        },
        {
          "SecurityQuestionId": 3,
          "Answer": "Imagínate"
        }
      ]
    };

    ProfileSettingsMock = {
      toSucceed: true,
      get: function() {
        return {
          then: function(success) {
            success(settingsData);
          }
        };
      },
      saveSecurityAnswers: function(){
        var toSucceed = this.toSucceed;
        return {
          then: function(success, failure) {
            if (toSucceed) {
              success({});
            }
          }
        };
      }
    };

    userData = [
      {
        "QuestionId": 1,
        "QuestionText": "What is the name of your favorite movie?"
      },
      {
        "QuestionId": 2,
        "QuestionText": "What is your favorite book?"
      },
      {
        "QuestionId": 3,
        "QuestionText": "What is your favorite song?"
      }
    ];

    UserMock = {
      getSecurityQuestions: function() {
        return {
          then: function(success) {
            success(userData);
          }
        };
      },
      clearUserInitRequired: noop
    };

    locationMock = {
      path: noop
    };

    scope = $rootScope.$new();
    LoginUpdateSecurityCtrl = $controller('LoginUpdateSecurityCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      $location: locationMock,
      ProfileSettings: ProfileSettingsMock,
      User: UserMock
    });

    // this is the form object used for validation
    scope.updateSecurity = {
      'q1': 1,
      'q1_res': 'Blue Lagoon',
      'q2': 3,
      'q2_res': 'Harry Potter'
    };

    // this is the actual model in the answer
    scope.updateSecurityModel = {
      'q1_res': 'Blue Lagoon',
      'q2_res': 'Harry Potter'
    };

    $httpBackend = _$httpBackend_;

  }));

  describe('questions', function() {

    it('it should be defined', function() {
      expect(scope.questions).toBeDefined();
    });

    it('should have 3 questions', function() {
      expect(scope.questions.length).toBe(3);
    });

  });

  describe('filteredQuestions', function() {

    it('should be defined', function() {
      expect(scope.filteredQuestions).toBeDefined();
    });

    it('should return the correctly filtered questions', function() {
      expect(scope.filteredQuestions('q1')).toEqual([
        { QuestionId: 1, QuestionText: 'What is the name of your favorite movie?' },
        { QuestionId: 2, QuestionText: 'What is your favorite book?' }
      ]);
      expect(scope.filteredQuestions('q2')).toEqual([
        { QuestionId: 2, QuestionText: 'What is your favorite book?' },
        { QuestionId: 3, QuestionText: 'What is your favorite song?' }
      ]);
      expect(scope.filteredQuestions('q3')).toEqual([
        { QuestionId: 2, QuestionText: 'What is your favorite book?' }
      ]);
      expect(scope.filteredQuestions()).toEqual([
        { QuestionId: 2, QuestionText: 'What is your favorite book?' }
      ]);
    });

  });

  describe('submitForm', function() {

    beforeEach(function() {
      $httpBackend.whenGET('/info/v1_1/businesshours').respond({});
    });

    it('should be defined', function() {
      expect(scope.submitForm).toBeDefined();
    });

    it('should call methods with the correct params', function() {
      ProfileSettingsMock.toSucceed = true; // tell the ProfileSettingsMock to succeed at submitting the form
      spyOn(ProfileSettingsMock, 'saveSecurityAnswers').andCallThrough();
      spyOn(UserMock, 'clearUserInitRequired');
      scope.submitForm();
      scope.$apply();
      expect(ProfileSettingsMock.saveSecurityAnswers).toHaveBeenCalledWith([
        { SecurityQuestionId: 1, Answer: 'Blue Lagoon'},
        { SecurityQuestionId: 3, Answer: 'Harry Potter'},
        { SecurityQuestionId: undefined, Answer: undefined} // not really possible in the UI, but true to the mocked data
      ]);

      expect(UserMock.clearUserInitRequired).toHaveBeenCalled();
    });

    it('should call methods and fail', function() {
      ProfileSettingsMock.toSucceed = false; // tell the ProfileSettingsMock to fail at submitting the form
      spyOn(ProfileSettingsMock, 'saveSecurityAnswers').andCallThrough();
      spyOn(UserMock, 'clearUserInitRequired');
      scope.submitForm();
      scope.$apply();
      expect(ProfileSettingsMock.saveSecurityAnswers).toHaveBeenCalled();

      expect(UserMock.clearUserInitRequired).not.toHaveBeenCalled();
    });

  });

  describe('cancel', function() {

    it('should be defined', function() {
      expect(scope.cancel).toBeDefined();
    });

  });

});
