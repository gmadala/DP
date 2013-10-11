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
      if (_.isEmpty(enteredEmail)) { return; }
      $scope.updateSecurity.email.$error.correctEmail = (existingEmail !== enteredEmail);
    };

    $scope.filteredQuestions = function(ignore) {
      var fields = _.map($scope.questions, function(q) { return q.n; }),
          filteredFields = _.reject(fields, function(f){ return f === ignore; }),
          filters = _.map(filteredFields, function(f) { return $scope[f]; }),
          filteredQuestions = _.reject(securityQuestions, function(q) {
            return filters.indexOf(q.QuestionId) !== -1;
          });
      return filteredQuestions;
    };

    $scope.submit = function() {
      // submit the form
      // save data to user
      // go home
      // $location.path('/home');
    };

    $scope.cancel = function() {
      // return to login
      $rootScope.broadcast('event:redirectToLogin');
    };

  });