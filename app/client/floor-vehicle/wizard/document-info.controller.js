(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope', 'User', 'kissMetricInfo', 'segmentio'];

  function DocumentInfoCtrl($scope, User) {
    $scope.files = [];
    $scope.invalidFiles = [];
    $scope.canAttachDocuments = false;
    $scope.submitInProgress = false;
    $scope.comments = '';

    $scope.$watch('files', function (newValue, oldValue) {
      if (newValue.length !== oldValue.length) {
        $scope.form.documents.$setValidity('pattern', true);
        $scope.form.documents.$setValidity('maxSize', true);
      }
    });

    // $scope.attachDocumentsEnabled = User.isUnitedStates()
    //   && (User.isDealer() && User.getFeatures().hasOwnProperty("uploadDocuments") && User.getFeatures().uploadDocuments.enabled)
    //   && (!User.isDealer() && User.getFeatures().hasOwnProperty("uploadDocumentsAuction") && User.getFeatures().uploadDocuments.enabled);
    $scope.attachDocumentsEnabled = true;

    $scope.$parent.wizardFloor.transitionValidation = function () {
      $scope.$parent.wizardFloor.formParts.three = true;
      return true;
    };

    $scope.removeInvalidFiles = function () {
      $scope.invalidFiles = [];
      $scope.form.boxDocuments.$setValidity('pattern', true);
      $scope.form.boxDocuments.$setValidity('maxSize', true);
      if ($scope.validity.boxDocuments) {
        $scope.validity.boxDocuments = angular.copy($scope.form.boxDocuments);
      }
      $scope.form.documents.$setValidity('pattern', true);
      $scope.form.documents.$setValidity('maxSize', true);
      if ($scope.validity.documents) {
        $scope.validity.documents = angular.copy($scope.form.documents);
      }
    };

    $scope.removeFile = function (file) {
      $scope.files = $scope.files.filter(function (f) {
        return f.name !== file.name;
      });
    };
  }
})();