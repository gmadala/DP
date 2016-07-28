(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('documentUpload', documentUpload);

  function documentUpload() {

    return {
      restrict: 'A',
      templateUrl: 'client/shared/directives/nxg-document-upload/nxg-document-upload.template.html',
      controller: function($scope) {

        $scope.removeFile = function(index) {
          $scope.files.splice(index, 1);
        };

        $scope.renameFile = function(file, index) {
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
      }
    };
  }
})();
