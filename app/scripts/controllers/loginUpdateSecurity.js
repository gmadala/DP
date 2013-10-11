'use strict';

angular.module('nextgearWebApp')
  .controller('LoginUpdateSecurityCtrl', function($rootScope, $scope, $q, User) {
    var securityQuestions;

    User.getSecurityQuestions().then(function(questions){
      securityQuestions = questions;
    });

    $scope.questions = [
      {n: 'q1'},
      {n: 'q2'},
      {n: 'q3'}
    ];

    $scope.filteredQuestions = function(ignore) {
      var fields = _.map($scope.questions, function(q) { return q.n; }),
          filteredFields = _.reject(fields, function(v){ return v === ignore; }),
          filters = _.map(filteredFields, function(filter) { return $scope[filter]; }),
          filteredQuestions = _.reject(securityQuestions, function(question) {
            return filters.indexOf(question.QuestionId) !== -1;
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