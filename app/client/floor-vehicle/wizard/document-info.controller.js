(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope'];

  function DocumentInfoCtrl($scope) {
    $scope.canAttachDocuments = false;
    $scope.submitInProgress = false;

    $scope.$parent.wizardFloor.renameFile = function (file, index) {
      var filename = "";
      var dotPos = 0;
      // Get all files before the current file
      var firstXFiles = _.first($scope.files, index);
      // Get all files that have same name as file
      var fileList = _.map(_.where(firstXFiles, {'name': file}), 'name');
      // If there are other files with the same name need to add index to file name
      var fileIndex = fileList.length;

      if (fileIndex > 0) {
        dotPos = file.lastIndexOf(".");
        filename = file.substring(0, dotPos) + fileIndex + file.substring(dotPos);
        return filename;
      }
      else {
        return file;
      }
    };

    $scope.$watch('$scope.$parent.wizardFloor.data.files', function (newValue, oldValue) {
      if (newValue && oldValue) {
        if (newValue.length !== oldValue.length) {

          $scope.form.documents.$setValidity('pattern', true);
          $scope.form.documents.$setValidity('maxSize', true);
        }
      }
    });

    $scope.$parent.wizardFloor.transitionValidation = function () {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      $scope.$parent.wizardFloor.formParts.three = $scope.form.$valid;

      return $scope.form.$valid;
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
