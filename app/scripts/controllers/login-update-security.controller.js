(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('LoginUpdateSecurityCtrl', LoginUpdateSecurityCtrl);

  LoginUpdateSecurityCtrl.$inject = [
    '$rootScope',
    '$scope',
    'segmentio',
    'metric',
    '$location',
    'User',
    'ProfileSettings',
    'kissMetricInfo'
  ];

  function LoginUpdateSecurityCtrl(
    $rootScope,
    $scope,
    segmentio,
    metric,
    $location,
    User,
    ProfileSettings,
    kissMetricInfo) {

    var securityQuestions;

    User.getSecurityQuestions().then(function(questions){
      securityQuestions = questions;
    });

    $scope.questions = [
      {name: 'q1', resName: 'q1_res'},
      {name: 'q2', resName: 'q2_res'},
      {name: 'q3', resName: 'q3_res'}
    ];

    $scope.updateSecurityModel = {};

    $scope.filteredQuestions = function(ignore) {
      // build an array of fields based on scope.questions
      var fields = _.map($scope.questions, function(q) { return q.name; }),
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
      var questions = [];

      // validate client-side
      $scope.validity = angular.copy($scope.updateSecurity);

      _.each($scope.questions, function(q) {
        // no question selected
        if (!$scope.updateSecurity[q.name]) {
          $scope.validity[q.name] = {$error: {required: true}};
        }
        // no answer filled out for the question
        else if (!$scope.updateSecurity[q.resName]) {
          $scope.validity[q.resName] = {$error: {required: true}};
        }
        // answer needs to be <= 100 chars long
        else if ($scope.updateSecurity[q.resName].length > 100) {
          $scope.validity[q.resName] = {$error: {maxLength: true}};
        }
        questions.push({
          SecurityQuestionId: $scope.updateSecurity[q.name],
          Answer: $scope.updateSecurityModel[q.resName]
        });
      });

      if ($scope.validity.$invalid) {
        return;
      }

      ProfileSettings.saveSecurityAnswers(questions).then(function() {

        kissMetricInfo.getKissMetricInfo().then(
          function(result){
            segmentio.track(metric.SECURITY_QUESTIONS_COMPLETED, result);
          }
        );

        //success
        User.clearUserInitRequired();
        $location.path('/home');
      });

    };

    $scope.cancel = function() {
      $rootScope.$emit('event:userRequestedLogout');
    };

  }
})();
