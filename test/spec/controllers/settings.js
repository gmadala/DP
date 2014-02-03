'use strict';

describe('Controller: SettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var SettingsCtrl,
    scope,
    settingsData,
    SettingsMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

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
      BusinessEmail: 'diana.guarin@manheim.com',
      EnhancedRegistrationEnabled: false,
      Addresses: [
        {
          BusinessAddressId: 'be9b22cb-5896-4356-86a0-e932293faa6a',
          City: 'Dallas',
          Fax: '2143399361',
          IsTitleReleaseAddress: true,
          Line1: '5333 West Kiest Blvd',
          Line2: null,
          State: 'TX',
          Zip: '75236',
          Phone: '2143301800'
        }
      ],
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

    SettingsMock = {
      get: function() {
        return {
          then: function(success) {
            success(settingsData);
          }
        }
      }
    }

    scope = $rootScope.$new();
    SettingsCtrl = $controller('SettingsCtrl', {
      $scope: scope,
      Settings: SettingsMock
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

        SettingsMock.saveProfile = function(username, password, email, cleanPhone, questions) {
          savingProfile = {
            username: username,
            password: password,
            email: email,
            cleanPhone: cleanPhone,
            questions: questions
          };
          return {
            then: function(callback){callback()}
          };
        };
        scope.profile.edit();
      });

      it('should define dirtyData and set editable to false', function() {
        scope.profile.save();

        expect(scope.profile.dirtyData).toBeDefined();
        expect(scope.profile.editable).toBe(false);
      });

      it('should format a phone number correctly', function() {
        scope.profile.dirtyData.phone = '(123)456-7890'
        scope.profile.save();

        expect(savingProfile.cleanPhone).toEqual('1234567890');
        expect(scope.profile.editable).toBe(false);
      });

      it('should change security question text correctly', function() {
        // Make sure we actualyl are performing a change
        expect(scope.profile.data.questions[0].SecurityQuestionId).toBe(1);
        expect(scope.profile.data.questions[0].QuestionText).toBe('What is the name of your favorite movie?')

        scope.profile.dirtyData.questions[0].SecurityQuestionId = 2;
        scope.profile.save();

        expect(scope.profile.data.questions[0].QuestionText).toBe('What is your favorite book?');
      });

      it('should have an empty string for question text if invalid question ID is selected', function() {
        scope.profile.dirtyData.questions[0].SecurityQuestionId = 100;
        scope.profile.save();

        expect(scope.profile.data.questions[0].QuestionText).toBe('');
      });

      it('should change security question text correctly', function() {
        // Make sure we actualyl are performing a change
        expect(scope.profile.data.questions[0].SecurityQuestionId).toBe(1);
        expect(scope.profile.data.questions[0].QuestionText).toBe('What is the name of your favorite movie?')

        scope.profile.dirtyData.questions[0].SecurityQuestionId = 2;
        scope.profile.save();

        expect(scope.profile.data.questions[0].QuestionText).toBe('What is your favorite book?');
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(SettingsMock, 'saveProfile');

        scope.profile.save();

        expect(SettingsMock.saveProfile).not.toHaveBeenCalled();
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

  describe('business', function() {
    it('business should exist on scope', function () {
      expect(scope.business.data).toBeDefined();
    });

    it('edit function should be defined for business', function() {
      expect(scope.business.edit).toBeDefined();
    });

    it('cancel function should be defined for business', function() {
      expect(scope.business.cancel).toBeDefined();
    });

    it('save function should be defined for business', function() {
      expect(scope.business.save).toBeDefined();
    });

    it('calling edit() on the business should set the business\'s editable property to true', function() {
      scope.business.edit();
      expect(scope.business.dirtyData).toEqual(scope.business.data);
      expect(scope.business.editable).toBe(true);
    });

    it('calling cancel() on the business should set the business\'s editable property to false', function() {
      scope.business.cancel();
      expect(scope.business.dirtyData).toBe(null);
      expect(scope.business.editable).toBe(false);
    });

    describe('save()', function(){
      var savingBusiness, validateResult;
      beforeEach(function() {
        validateResult = true;
        spyOn(scope.business, 'validate').andCallFake(function() {
          return validateResult;
        });
        spyOn(scope.business, 'isDirty').andReturn(true);

        SettingsMock.saveBusiness = function(email, enhancedRegistrationEnabled, enhancedRegistrationPin) {
          savingBusiness = {
            email: email,
            enhancedRegistrationPin: enhancedRegistrationPin,
            enhancedRegistrationEnabled: enhancedRegistrationEnabled
          };
          return {
            then: function(callback){callback()}
          };
        };
        scope.business.edit();
      });

      it('should define dirtyData and set editable to false', function() {
        scope.business.save();

        expect(scope.business.dirtyData).toBeDefined();
        expect(scope.business.editable).toBe(false);
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(SettingsMock, 'saveBusiness');

        scope.business.save();

        expect(SettingsMock.saveBusiness).not.toHaveBeenCalled();
      });
    });
  });

  describe('title', function() {
    it('title should exist on scope', function () {
      expect(scope.title.data).toBeDefined();
    });

    it('edit function should be defined for title', function() {
      expect(scope.title.edit).toBeDefined();
    });

    it('cancel function should be defined for title', function() {
      expect(scope.title.cancel).toBeDefined();
    });

    it('save function should be defined for title', function() {
      expect(scope.title.save).toBeDefined();
    });

    it('calling edit() on the title should set the title\'s editable property to true', function() {
      spyOn(scope.title, 'updateAddressSelection');
      scope.title.edit();
      expect(scope.title.updateAddressSelection).toHaveBeenCalled();
      expect(scope.title.dirtyData).toEqual(scope.title.data);
      expect(scope.title.editable).toBe(true);
    });

    it('calling cancel() on the title should set the title\'s editable property to false', function() {
      scope.title.cancel();
      expect(scope.title.dirtyData).toBe(null);
      expect(scope.title.editable).toBe(false);
    });

    describe('save()', function(){
      var savingTitle, validateResult;
      beforeEach(function() {
        validateResult = true;
        spyOn(scope.title, 'validate').andCallFake(function() {
          return validateResult;
        });
        spyOn(scope.title, 'isDirty').andReturn(true);
        spyOn(scope.title, 'updateAddressSelection');

        SettingsMock.saveTitleAddress = function(titleAddressId) {
          savingTitle = {
            titleAddressId: titleAddressId
          };
          return {
            then: function(callback){callback()}
          };
        };

        scope.title.data.titleAddress = {
          BusinessAddressId: 1
        };

        scope.title.edit();
      });

      it('should define dirtyData and set editable to false and call updateAddressSelection', function() {
        scope.title.save();

        expect(scope.title.updateAddressSelection).toHaveBeenCalled();
        expect(scope.title.dirtyData).toBeDefined();
        expect(scope.title.editable).toBe(false);
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(SettingsMock, 'saveTitleAddress');

        scope.title.save();

        expect(SettingsMock.saveTitleAddress).not.toHaveBeenCalled();
      });

    });

  });

});
