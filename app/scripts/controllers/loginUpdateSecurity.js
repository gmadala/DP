'use strict';

angular.module('nextgearWebApp')
  .controller('LoginUpdateSecurityCtrl', function($rootScope, $scope, $q, User, Settings) {
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
          console.log($scope.updateSecurity)
      return filteredQuestions;
    };

    $scope.submitForm = function() {
      if ($scope.updateSecurity.$invalid) { return; }
      // submit the form
      // save data to user
      // go home
      // $location.path('/home');
    };

    $scope.cancel = function() {
      // return to login
      $rootScope.$broadcast('event:redirectToLogin');
    };

  });