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
      saveProfile: function(/*username, password, email, phone, securityAnswers*/) {
        // TODO: Hook up correct api call
      }
    };
  });
