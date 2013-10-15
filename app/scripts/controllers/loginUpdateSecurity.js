'use strict';

angular.module('nextgearWebApp')
  .controller('LoginUpdateSecurityCtrl', function($rootScope, $scope, $location, User, Settings) {
    var securityQuestions,
        existingEmail;

    User.getSecurityQuestions().then(function(questions){
      securityQuestions = questions;
    });

    Settings.get().then(function(res) {
      existingEmail = res.Email;
    });

    $scope.questions = [
      {n: 'q1'},
      {n: 'q2'},
      {n: 'q3'}
    ];

    $scope.validateEmail = function(enteredEmail) {
      var valid = existingEmail === enteredEmail;
      if (_.isEmpty(enteredEmail)) { return; } //do nothing if we're empty
      $scope.updateSecurity.email.$setValidity('correctEmail', valid);
    };

    $scope.filteredQuestions = function(ignore) {
          // build an array of fields based on scope.questions
      var fields = _.map($scope.questions, function(q) { return q.n; }),
          // filter out the current 'ignore' value
          filteredFields = _.reject(fields, function(f){ return f === ignore; }),
          // grab the security question ids that are 'taken'
          filters = _.map(filteredFields, function(f) { return $scope.updateSecurity[f]; }),
          // reject all questions that have been selected
          filteredQuestions = _.reject(securityQuestions, function(q) {
            return filters.indexOf(q.QuestionId) !== -1;
          });
      return filteredQuestions;
    };

    $scope.submitForm = function() {
      var securityQuestions = _.map($scope.questions, function(q) {
        return {
          SecurityQuestionId: $scope.updateSecurity[q.n],
          Answer: $scope.updateSecurity[q.n + '_res']
        };
      });

      Settings.saveSecurityAnswers(securityQuestions);
      User.setShowUserInitialization(false);
      $location.path('/home');
    };

    $scope.cancel = function() {
      $rootScope.$broadcast('event:redirectToLogin');
    };

  });