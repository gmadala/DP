(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope', 'User', 'kissMetricInfo', 'segmentio'];

  function DocumentInfoCtrl($scope, User) {
    $scope.canAttachDocuments = false;
    $scope.submitInProgress = false;

    console.log($scope.$parent.wizardFloor.data.files);

    $scope.$watch('$scope.$parent.wizardFloor.data.files', function (newValue, oldValue) {

      if (newValue.length !== oldValue.length) {
        $scope.form.documents.$setValidity('pattern', true);
        $scope.form.documents.$setValidity('maxSize', true);
      }
    });

    // $scope.attachDocumentsEnabled = User.isUnitedStates()
    //   && (User.isDealer() && User.getFeatures().hasOwnProperty("uploadDocuments") && User.getFeatures().uploadDocuments.enabled)
    //   && (!User.isDealer() && User.getFeatures().hasOwnProperty("uploadDocumentsAuction") && User.getFeatures().uploadDocuments.enabled);
    // $scope.attachDocumentsEnabled = true;

    $scope.$parent.wizardFloor.transitionValidation = function () {
      $scope.$parent.wizardFloor.formParts.three = true;
      return true;
    };

    $scope.removeInvalidFiles = function () {
      $scope.$parent.wizardFloor.data.invalidFiles = [];
      $scope.form.boxDocuments.data.$setValidity('pattern', true);
      $scope.form.boxDocuments.data.$setValidity('maxSize', true);
      if ($scope.$parent.wizardFloor.data.validity.boxDocuments) {
        $scope.$parent.wizardFloor.data.validity.boxDocuments = angular.copy($scope.form.boxDocuments);
      }
      $scope.form.documents.$setValidity('pattern', true);
      $scope.form.documents.$setValidity('maxSize', true);
      if ($scope.$parent.wizardFloor.data.validity.documents) {
        $scope.$parent.wizardFloor.data.validity.documents = angular.copy($scope.form.documents);
      }
    };

    $scope.removeFile = function (file) {
      $scope.$parent.wizardFloor.data.files = $scope.$parent.wizardFloor.data.files.filter(function (f) {
        return f.name !== file.name;
      });
    };
  }
})();