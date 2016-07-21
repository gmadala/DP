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
          // Rename all iphone images with the index
          if (file === "image.jpeg") {
            dotPos = file.lastIndexOf(".");
            filename = file.substring(0, dotPos) + index + file.substring(dotPos);
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
