(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope', 'User', 'kissMetricInfo', 'segmentio'];

  function DocumentInfoCtrl($scope, User) {
    $scope.canAttachDocuments = false;
    $scope.submitInProgress = false;

    $scope.$watch('$scope.$parent.wizardFloor.data.files', function (newValue, oldValue) {
      if (newValue && oldValue) {
        if (newValue.length !== oldValue.length) {
          console.log(newValue);
          $scope.form.documents.$setValidity('pattern', true);
          $scope.form.documents.$setValidity('maxSize', true);
        }
      }
    });

    $scope.$parent.wizardFloor.transitionValidation = function () {
      // $scope.form.$submitted = true;
      // $scope.$parent.wizardFloor.validity = angular.copy($scope.form.documents);
      // $scope.$parent.wizardFloor.formParts.one = $scope.form.$valid;
      return $scope.form.documents.$valid && $scope.form.boxDocuments.$valid ;
    };

    $scope.removeInvalidFiles = function () {
      $scope.$parent.wizardFloor.data.invalidFiles = [];
      $scope.form.boxDocuments.$setValidity('pattern', true);
      $scope.form.boxDocuments.$setValidity('maxSize', true);
      if ($scope.$parent.wizardFloor.validity.boxDocuments) {
        $scope.$parent.wizardFloor.validity.boxDocuments = angular.copy($scope.form.boxDocuments);
      }
      $scope.form.documents.$setValidity('pattern', true);
      $scope.form.documents.$setValidity('maxSize', true);
      if ($scope.$parent.wizardFloor.validity.documents) {
        $scope.$parent.wizardFloor.validity.documents = angular.copy($scope.form.documents);
      }
    };

    $scope.removeFile = function (file) {
      $scope.$parent.wizardFloor.data.files = $scope.$parent.wizardFloor.data.files.filter(function (f) {
        return f.name !== file.name;
      });
    };
  }
})();