'use strict';

angular.module('nextgearWebApp')
  .factory('Settings', function($q, api, User) {

    var prv = {
      getQuestionText: function(id, questions) {
        for (var i = 0; i < questions.length; i++) {
          if (questions[i].QuestionId === id) {
            return questions[i].QuestionText;
          }
        }
        return '';
      },
      getSecurityAnswers: function(securityAnswers) {
        var res = [];
        for (var i = 0; i < securityAnswers.length; i++) {
          res.push({
            SecurityQuestionId: securityAnswers[i].SecurityQuestionId,
            Answer: securityAnswers[i].Answer
          });
        }
        return res;
      }
    };

    return {
      get: function() {
        return $q.all([
            api.request('GET', '/userAccount/settings'),
            User.getSecurityQuestions(),
            api.request('GET', '/userAccount/availableNotifications')
          ]).then(function(responses) {
            var settings = responses[0],
              questions = responses[1],
              i;

            // add available notifications
            settings.AvailableNotifications = responses[2];

            // Fill in question data
            for (i = 0; i < settings.SecurityQuestions.length; i++) {
              var q = settings.SecurityQuestions[i];
              q.QuestionText = prv.getQuestionText(q.SecurityQuestionId, questions);
            }
            settings.AllSecurityQuestions = questions;

            for (i = 0; i < settings.Addresses.length; i++) {
              var addr = settings.Addresses[i];
              if (addr.IsTitleReleaseAddress) {
                settings.CurrentTitleReleaseAddress = addr;
              }
            }
            return settings;
          });
      },
      saveSecurityAnswers: function(securityAnswers) {
        var req = {
          SecurityAnswers: prv.getSecurityAnswers(securityAnswers)
        };

        return api.request('POST', '/UserAccount/usersettings', req);
      },
      saveProfile: function(username, password, email, phone, securityAnswers) {
        var req = {
          Username: username,
          EmailAddress: email,
          Cellphone: phone,
          SecurityAnswers: prv.getSecurityAnswers(securityAnswers)
        };

        if (password) {
          req.Password = password;
        }
        return api.request('POST', '/UserAccount/usersettings', req);
      },
      saveBusiness: function(email, enhancedRegEnabled, enhancedRegPin) {
        var req = {
          BusinessEmailAddress: email,
          EnhancedRegistrationEnabled: enhancedRegEnabled
        };
        if (enhancedRegEnabled) {
          req.EnhancedRegistrationPin = enhancedRegPin;
        }
        return api.request('POST', '/UserAccount/businessSettings', req);
      },
      saveTitleAddress: function(addressId) {
        var req = {
          TitleReleaseAddressId: addressId
        };
        return api.request('POST', '/UserAccount/titleSettings', req);
      },
      saveNotifications: function(notifications) {
        return api.request('POST', '/UserAccount/notificationSettings', notifications);
      }
    };
  })
;
