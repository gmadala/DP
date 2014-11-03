'use strict';

describe('Model: ProfileSettings', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend, $q, profileSettings, emailStub, securityAnswersStub, api, user, success;

  beforeEach(inject(function ($httpBackend, _$q_, ProfileSettings, _api_, User) {
    httpBackend = $httpBackend;
    $q = _$q_;
    api = _api_;
    user = User;
    profileSettings = ProfileSettings;
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

    success = {
      Success: true,
      Message: null,
      Data: null
    };

    httpBackend.whenPOST('/UserAccount/V2_2/setupNewUser').respond(success);

    httpBackend.whenPOST('/UserAccount/usersettings').respond(success);
  }));

  describe('saveSecurityAnswers method', function() {

    it('should make the expected POST request', function () {
      httpBackend.expectPOST('/UserAccount/V2_2/setupNewUser');
      profileSettings.saveSecurityAnswers(securityAnswersStub);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise', function () {
      var res = null;

      profileSettings.saveSecurityAnswers(securityAnswersStub).then(function (result) {
        res = result;
      })
      httpBackend.flush();
      expect(res).toBeDefined();
    });

  });

  describe('saveProfile method', function() {

    it('should make the expected POST request', function() {
      httpBackend.expectPOST('/UserAccount/usersettings');
      profileSettings.saveProfile('username', 'password', emailStub, 'phone', securityAnswersStub);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise', function() {
      var res;
      httpBackend.expectPOST('/UserAccount/usersettings');

      profileSettings.saveProfile('username', 'password', emailStub, 'phone', securityAnswersStub).then(function (result) {
        res = result;
      });

      httpBackend.flush();

      expect(res).toBeDefined();
    });

  });

  describe('saveNotifications method', function() {

    it('should make an API request', function() {
      spyOn(api, 'request');
      profileSettings.saveNotifications({});
      expect(api.request).toHaveBeenCalled();
    });

  });

  describe('get method', function() {

    beforeEach(function() {
      spyOn($q, 'all').andReturn({
        then: function(success) {
          var result = success([
            settings,
            securityQuestions,
            notifications
          ]);
          // need to chain promises
          return {
            then: function(success) {
              success(result);
            }
          };
        }
      });

      spyOn(user, 'getSecurityQuestions').andReturn({
        then: angular.noop
      });
      httpBackend.expectGET('/userAccount/v1_1/settings').respond(success);
      httpBackend.expectGET('/userAccount/availableNotifications').respond(success);

    });

    it('should call get()', function() {
      var res;

      profileSettings.get().then(function (result) {
        res = result;
      });
      httpBackend.flush();

      expect(res).toBeDefined();
    });

  });

  var notifications = [
    {
      "NotificationId": "e4b6c079-3ae0-4ac4-84bc-0000d56bb2f5",
      "Name": "Weekly Upcoming Payments",
      "DeliveryMethods": [
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403d84",
          "Name": "Email"
        },
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403000",
          "Name": "Text"
        }
      ]
    },
    {
      "NotificationId": "e4b6c079-3ae0-4ac4-00bc-0474d56bb2f5",
      "Name": "Overdue Payments",
      "DeliveryMethods": [
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403d84",
          "Name": "Email"
        },
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403000",
          "Name": "Text"
        }
      ]
    },
    {
      "NotificationId": "e4b6c079-3ae0-4004-84bc-0474d56bb2f5",
      "Name": "Disbursements",
      "DeliveryMethods": [
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403d84",
          "Name": "Email"
        },
        {
          "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403000",
          "Name": "Text"
        }
      ]
    }
  ];

  var securityQuestions = [
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

  var settings = {
    "Username": "10264DG",
    "SecurityQuestions": [
      {
        "SecurityQuestionId": 1,
        "Answer": "The Matrix"
      },
      {
        "SecurityQuestionId": 2,
        "Answer": "Harry Potter"
      },
      {
        "SecurityQuestionId": 3,
        "Answer": "Imagínate"
      }
    ],
    "Email": "diana.guarin@manheim.com",
    "CellPhone": "2143301800",
    "Notifications": [
      {
        "NotificationId": "e4b6c079-3ae0-4ac4-84bc-0000d56bb2f5",
        "NotificationName": "Weekly Upcoming Payments",
        "DeliveryMethodId": "489191eb-3df6-4507-85c5-a9e8d4403d84",
        "DeliveryMethodName": "Email"
      }
    ]
  };

});