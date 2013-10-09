'use strict';

angular.module('nextgearWebApp')
  .factory('Settings', function(api, User) {

    var prv = {
      getQuestionText: function(id, questions) {
        for (var i = 0; i < questions.length; i++) {
          if (questions[i].QuestionId === id) {
            return questions[i].QuestionText;
          }
        }
        return '';
      }
    };

    return {
      get: function() {
        return api.request('GET', '/userAccount/settings').then(
          function(settings) {
            return User.getSecurityQuestions().then(function(questions) {
              for (var i = 0; i < settings.SecurityQuestions.length; i++) {
                var q = settings.SecurityQuestions[i];
                q.QuestionText = prv.getQuestionText(q.SecurityQuestionId, questions);
              }
              settings.AllSecurityQuestions = questions;
              return settings;
            });
          }
        );
      },
      saveProfile: function(username, password, email, phone, securityAnswers) {
        var req = {
          Username: username,
          EmailAddress: email,
          Cellphone: phone,
          SecurityAnswers: []
        };
        for (var i = 0; i < securityAnswers.length; i++) {
          req.SecurityAnswers.push({
            SecurityQuestionId: securityAnswers[i].SecurityQuestionId,
            Answer: securityAnswers[i].Answer
          });
        }
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
        return api.request('POST', '/api/userAccount/businessSettings', req);
      }
    };
  });
