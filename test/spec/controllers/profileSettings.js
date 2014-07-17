'use strict';

describe('Controller: ProfileSettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ProfileSettingsCtrl,
    scope,
    settingsData,
    ProfileSettingsMock,
    $rootScope,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$q_) {

    $q = _$q_;

    settingsData = {
      Username: '10264DG',
      SecurityQuestions: [
        {
          SecurityQuestionId: 1,
          Answer: 'The Matrix',
          QuestionText: 'What is the name of your favorite movie?'
        },
        {
          SecurityQuestionId: 3,
          Answer: 'Imagínate',
          QuestionText: 'What is your favorite book?'
        }
      ],
      Email: 'diana.guarin@manheim.com',
      CellPhone: '2143301800',
      EnhancedRegistrationEnabled: false,
      Notifications: [
        {
          NotificationId: 'e4b6c079-3ae0-4ac4-84bc-0474d56bb2f5',
          NotificationName: 'Some Notification',
          DeliveryMethodId: '489191eb-3df6-4507-85c5-a9e8d4403d84',
          DeliveryMethodName: 'Email',
          Enabled: false
        }
      ],
      AllSecurityQuestions: [
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
      ]
    };

    ProfileSettingsMock = {
      get: function() {
        return {
          then: function(success) {
            success(settingsData);
          }
        }
      }
    }

    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
    ProfileSettingsCtrl = $controller('ProfileSettingsCtrl', {
      $scope: scope,
      ProfileSettings: ProfileSettingsMock
    });
  }));

  describe('profile', function() {
    it('profile should exist on scope', function () {
      expect(scope.profile.data).toBeDefined();
    });

    it('edit function should be defined for profile', function() {
      expect(scope.profile.edit).toBeDefined();
    });

    it('cancel function should be defined for profile', function() {
      expect(scope.profile.cancel).toBeDefined();
    });

    it('save function should be defined for profile', function() {
      expect(scope.profile.save).toBeDefined();
    });

    it('calling edit() on the profile should set the profile\'s editable property to true', function() {
      scope.profile.edit();
      expect(scope.profile.dirtyData).toEqual(scope.profile.data);
      expect(scope.profile.editable).toBe(true);
    });

    it('calling cancel() on the profile should set the profile\'s editable property to false', function() {
      scope.profile.cancel();
      expect(scope.profile.dirtyData).toBe(null);
      expect(scope.profile.editable).toBe(false);
    });

    describe('save()', function(){
      var savingProfile, validateResult;
      beforeEach(function() {
        validateResult = true;
        spyOn(scope.profile, 'validate').andCallFake(function() {
          return validateResult;
        });
        spyOn(scope.profile, 'isDirty').andReturn(true);

        ProfileSettingsMock.saveProfile = function(username, password, email, cleanPhone, questions) {
          savingProfile = {
            username: username,
            password: password,
            email: email,
            cleanPhone: cleanPhone,
            questions: questions
          };
          return $q.when();
        };
        scope.profile.edit();
      });

      it('should define dirtyData and set editable to false', function() {
        scope.profile.save();
        $rootScope.$digest();

        expect(scope.profile.dirtyData).toBeDefined();
        expect(scope.profile.editable).toBe(false);
      });

      it('should format a phone number correctly', function() {
        scope.profile.dirtyData.phone = '(123)456-7890'
        scope.profile.save();
        $rootScope.$digest();

        expect(savingProfile.cleanPhone).toEqual('1234567890');
        expect(scope.profile.editable).toBe(false);
      });

      it('should change security question text correctly', function() {
        // Make sure we actualyl are performing a change
        expect(scope.profile.data.questions[0].SecurityQuestionId).toBe(1);
        expect(scope.profile.data.questions[0].QuestionText).toBe('What is the name of your favorite movie?')

        scope.profile.dirtyData.questions[0].SecurityQuestionId = 2;
        scope.profile.save();
        $rootScope.$digest();

        expect(scope.profile.data.questions[0].QuestionText).toBe('What is your favorite book?');
      });

      it('should have an empty string for question text if invalid question ID is selected', function() {
        scope.profile.dirtyData.questions[0].SecurityQuestionId = 100;
        scope.profile.save();
        $rootScope.$digest();

        expect(scope.profile.data.questions[0].QuestionText).toBe('');
      });

      it('should change security question text correctly', function() {
        // Make sure we actualyl are performing a change
        expect(scope.profile.data.questions[0].SecurityQuestionId).toBe(1);
        expect(scope.profile.data.questions[0].QuestionText).toBe('What is the name of your favorite movie?')

        scope.profile.dirtyData.questions[0].SecurityQuestionId = 2;
        scope.profile.save();
        $rootScope.$digest();

        expect(scope.profile.data.questions[0].QuestionText).toBe('What is your favorite book?');
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(ProfileSettingsMock, 'saveProfile');

        scope.profile.save();
        $rootScope.$digest();

        expect(ProfileSettingsMock.saveProfile).not.toHaveBeenCalled();
      });

    });

    describe('validatePasswordPattern()', function() {

      it('should require 3 of the 4 categories', function() {
        expect(scope.profile.validatePasswordPattern('abcdefgh')).toBe(false);
        expect(scope.profile.validatePasswordPattern('abcDEFgh')).toBe(false);
        expect(scope.profile.validatePasswordPattern('abcdefg1')).toBe(false);
        expect(scope.profile.validatePasswordPattern('abcDEFg1')).toBe(true);
        expect(scope.profile.validatePasswordPattern('ABC123%^')).toBe(true);
        expect(scope.profile.validatePasswordPattern('abCD12&^')).toBe(true);
      });

      it('should require 8 characters', function() {
        expect(scope.profile.validatePasswordPattern('abC7&eu')).toBe(false);
      });

    });

  });

});
