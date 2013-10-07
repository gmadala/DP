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
    expect(scope.profile.editable).toBe(true);
  });
});
