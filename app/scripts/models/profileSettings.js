'use strict';

angular.module('nextgearWebApp')
  .factory('ProfileSettings', function($q, api, User) {

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

            settings.BusinessEmail = undefined;

            // add available notifications
            settings.AvailableNotifications = responses[2];

            // Fill in question data
            for (i = 0; i < settings.SecurityQuestions.length; i++) {
              var q = settings.SecurityQuestions[i];
              q.QuestionText = prv.getQuestionText(q.SecurityQuestionId, questions);
            }
            settings.AllSecurityQuestions = questions;

            return settings;
          });
      },
      saveSecurityAnswersAndEmail: function(email, securityAnswers) {
        var req = {
          EmailAddress: email,
          SecurityAnswers: prv.getSecurityAnswers(securityAnswers)
        };

        return api.request('POST', '/UserAccount/setupNewUser', req);
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
      saveNotifications: function(notifications) {
        return api.request('POST', '/UserAccount/notificationSettings', notifications);
      }
    };
  })
;
